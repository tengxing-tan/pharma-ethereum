import ProductDescription from "app/_ui/product-description";
import { getDrugById } from "app/api/action/getDrug";
import { getDrugBatchByDrugId } from "app/api/action/getDrugBatch";
import { getStakeholderById, getStakeholderByManufacturerId } from "app/api/action/getStakeholder";
import Link from "next/link";

export default async function Page({ params }: { params: { id: string } }) {
    const drugBatches = await getDrugBatchByDrugId(Number(params.id))
    const drug = await getDrugById(Number(params.id))
    if (!drugBatches || !drug) {
        throw new Error("Drug batch not found")
    }
    let owner, manufacturer
    if (drug.ownerId) {
        owner = await getStakeholderById(drug.ownerId)
    }
    if (drug.manufacturerId) {
        manufacturer = await getStakeholderByManufacturerId(drug.manufacturerId)
    }
    if (owner === undefined) return null
    if (manufacturer === undefined) return null

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 sm:py-12">
            <ProductDescription props={{
                drug: drug,
                owner: owner,
                manufacturer: manufacturer,
            }} />
            {/* Batches */}
            <div className="w-full">
                <h3 className="text-2xl text-gray-800 font-bold py-4">Batches</h3>
                <p className="text-sm text-gray-700 pb-2">Showing {drugBatches ? drugBatches.length : '0'} rows.</p>
                <div className="grid grid-cols-3 font-semibold text-gray-700 pb-1 mb-6  border-b">
                    <p>Batch no.</p>
                    <p>Date</p>
                </div>
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                    {drugBatches ? drugBatches.map((item) => (
                        <li key={item.id} className="grid grid-cols-3 py-2 text-gray-800">
                            <Link href={`/trace/${item.batchNo}`}>
                                <p className="font-mono hover:underline">{item.batchNo}</p>
                            </Link>
                            <p className="text-sm">{item.createdAt.toLocaleDateString()}</p>
                        </li>
                    )) :
                        <li className="py-12 text-center text-gray-700">No batches yet.</li>}
                </ul>
            </div>
        </div>
    )
}
