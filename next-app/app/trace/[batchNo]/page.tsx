import { Heading } from "app/_ui/heading";
import ProductDescription from "app/_ui/product-description";
import ScOverview from "app/trace/_component/sc-overview";
import { getDrugById } from "app/api/action/getDrug";
import { getDrugBatchByBatchNo } from "app/api/action/getDrugBatch";
import { getStakeholderById, getStakeholderByImporterId, getStakeholderByManufacturerId, getStakeholderByWholesalerId } from "app/api/action/getStakeholder";
import Link from "next/link";

export default async function Page({ params }: {
    params: { batchNo: string }
}) {

    const drugBatch = await getDrugBatchByBatchNo(params.batchNo)
    const drug = await getDrugById(Number(drugBatch?.drugId))
    if (!drugBatch || !drug) {
        throw new Error("Drug batch not found")
    }

    let owner, manufacturer, importer, wholesaler
    if (drug.ownerId) {
        owner = await getStakeholderById(drug.ownerId)
    }
    if (drug.manufacturerId) {
        manufacturer = await getStakeholderByManufacturerId(drug.manufacturerId)
    }
    importer = (drugBatch.importerId)
        ? await getStakeholderByImporterId(drugBatch.importerId)
        : undefined
    wholesaler = (drugBatch.wholesalerId)
        ? await getStakeholderByWholesalerId(drugBatch.wholesalerId)
        : undefined

    return (
        <div className="px-6 w-full max-w-3xl">
            <Link href="/trace">
                <Heading heading="Trace Pharmaceuticals" />
            </Link>
            {owner ? (
                <div className="p-4 bg-gray-50 border-l-2 rounded-sm border-primary-500">
                    <ProductDescription props={{
                        drug: drug,
                        owner: owner,
                        manufacturer: manufacturer,
                    }} />
                </div>
            ) : null}

            <div className="mt-8">
                <h3 className="text-gray-700 text-3xl pb-2">
                    Blockchain Information</h3>
                <div className="bg-gray-50 p-4">
                    {/* <p className="text-gray-700">
                    Transaction hash: <p className="inline-block p-1 font-mono font-semibold text-xs text-primary-600">
                        0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9</p></p> */}
                    <div className="text-gray-700 font-mono text-sm">
                        &gt; The company had verified at: &nbsp;
                        <p className="inline-block p-1 font-semibold text-xs text-primary-600">
                            {`1/5/2024, 10:28:46 PM`}</p>
                    </div>
                </div>
            </div>

            <div className="pt-6">
                <h2 className="py-4 text-3xl text-gray-800">Supply Chain Overview</h2>
                <ScOverview props={{
                    drugBatch: drugBatch,
                    manufacturer: manufacturer,
                    importer: importer,
                    wholesaler: wholesaler,
                }} />
            </div>
        </div>
    )
}
