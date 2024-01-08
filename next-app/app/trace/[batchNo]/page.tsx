import { Heading } from "app/_ui/heading";
import ProductDescription from "app/_ui/product-description";
import ScOverview from "app/trace/_component/sc-overview";
import { getDrugById } from "app/api/action/getDrug";
import { getDrugBatchByBatchNo } from "app/api/action/getDrugBatch";
import { getStakeholderById, getStakeholderByImporterId, getStakeholderByManufacturerId, getStakeholderByWholesalerId } from "app/api/action/getStakeholder";
import Link from "next/link";
import { StakeholderObj } from "@/app/admin/_components/stakeholder-profile";
import { getStakeholderOnEth } from "@/lib/smart-contracts/manage-stakeholders";
import clsx from "clsx";

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
    if (owner === undefined || !owner) return null
    if (manufacturer === undefined || !manufacturer) return null

    const ownerOnEth = await getStakeholderOnEth(owner.metaMaskAcc)
    const manufacturerOnEth = await getStakeholderOnEth(manufacturer.metaMaskAcc)

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

            <div className="mt-8 space-y-2">
                <h3 className="text-2xl text-gray-700 font-bold">Data on Blockchain: </h3>
                <h4 className="text-sm text-gray-500 font-bold">Holder Information</h4>
                <BlockchainData stakeholder={ownerOnEth} transactionHash={owner.transactionHash} />
                <h4 className="text-sm text-gray-500 font-bold">Manufacturer Information</h4>
                <BlockchainData stakeholder={manufacturerOnEth} transactionHash={manufacturer.transactionHash} />
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

function BlockchainData({ stakeholder, transactionHash }: {
    stakeholder: StakeholderObj | null,
    transactionHash: string | null
}) {
    // Ethereum
    const stakeholderOnEth = stakeholder
    const isVerified = stakeholderOnEth ? stakeholderOnEth.isAuthentic : null

    return (
        <>
            <div className="font-mono text-xs text-gray-500">
                <div className="grid grid-cols-3">
                    {/* Blockchain data */}
                    <p>&gt; MetaMask Account</p>
                    {/* MetaMask account */}
                    <code className="text-gray-700 col-span-2">
                        {stakeholderOnEth && stakeholderOnEth.metamaskAccount !== ''
                            ? stakeholderOnEth.metamaskAccount
                            : 'no data'}
                    </code>
                    {/* Verified status */}
                    <p>&gt; Authenticity</p>
                    <code className={clsx(
                        "col-span-2 w-fit rounded font-bold",
                        isVerified ? "text-green-500" : "text-rose-500"
                    )}>
                        {(isVerified === null) ? 'no data'
                            : (isVerified) ? "Verified" : "Unverified"}
                    </code>
                    {/* Email */}
                    <p>&gt; Email</p>
                    <code className="text-primary-500 col-span-2">
                        {stakeholderOnEth && stakeholderOnEth.email !== ''
                            ? stakeholderOnEth.email
                            : 'no data'}
                    </code>
                    {/* verfied at */}
                    <p>&gt; Registered At</p>
                    <code className="text-gray-700 col-span-2">
                        {stakeholderOnEth && Number(stakeholderOnEth.registeredAt) !== 0
                            ? new Date(Number(stakeholderOnEth.registeredAt) * 1000).toString()
                            : 'no data'
                        }</code>
                    {/* verfied at */}
                    <p>&gt; Verfied At</p>
                    <code className="text-gray-700 col-span-2">
                        {stakeholderOnEth && Number(stakeholderOnEth.verifiedAt) !== 0
                            ? new Date(Number(stakeholderOnEth.verifiedAt) * 1000).toString()
                            : 'no data'
                        }</code>
                    {/* transaction hash */}
                    <p>&gt; Transaction hash</p>
                    <code className="text-gray-700 col-span-2">
                        {transactionHash ?? 'no data'}</code>
                </div>
            </div>
        </>
    )
}
