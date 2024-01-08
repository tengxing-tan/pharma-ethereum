import { Drug, Stakeholder } from "@prisma/client";
import { StakeholderObj } from "@/app/admin/_components/stakeholder-profile";
import { getStakeholderOnEth } from "@/lib/smart-contracts/manage-stakeholders";

export default async function ProductDescription({ props }: {
    props: {
        drug: Drug | null,
        owner: Stakeholder | null,
        manufacturer: Stakeholder | null,
    }
}) {
    // Validate props
    if (!props.drug || !props.owner || !props.manufacturer) return <SomethingWrong />
    const drug = props.drug
    const owner = props.owner
    const manufacturer = props.manufacturer

    // Ethereum
    // const stakeholderOnEth: StakeholderObj = await getStakeholderOnEth(owner.metaMaskAcc)
    // const isVerified = stakeholderOnEth && stakeholderOnEth.isAuthentic

    // Handle error logic
    function SomethingWrong() {
        return (
            <div>
                Something wrong
            </div>
        )
    }

    return (
        <div className="bg-white w-full p-4 rounded shadow border border-gray-200">
            <div className="text-gray-700 text-sm">
                {/* Product details */}
                <p className="text-lg font-semibold capitalize">
                    {drug.name.toLowerCase()}</p>
                {/* Register no */}
                <p className="text-xs font-mono font-semibold capitalize text-primary-500">
                    {drug.registrationNo.toUpperCase()}</p>
                {/* Ingredient & dosage form */}
                <p className="capitalize">
                    {drug.activeIngredient.toLowerCase()} ({drug.dosageForm.toLowerCase()})
                </p>
                <p>
                    Register on: {drug.createdAt.toLocaleString().toLocaleLowerCase()}
                </p>
                <div className="pt-2">
                    <h3 className="text-xs text-green-700 font-bold pb-1">Holder: </h3>
                    <CompanyInfo company={owner} />
                </div>
                {/* manufacturer */}
                <div className="pt-2">
                    <h3 className="text-xs text-purple-700 font-bold pb-1">Manufacturer: </h3>
                    <CompanyInfo company={manufacturer} />
                </div>
            </div>
        </div>
    )
}

function CompanyInfo({ company }: {
    company: Stakeholder
}) {
    return (
        <>
            {/* MetaMask Account */}
            <p className="mb-1 p-1 text-xs w-fit font-mono font-semibold rounded border border-gray-300 text-gray-500">🦊 {company.metaMaskAcc}</p>

            <div className="text-sm text-gray-600 grid grid-cols-2">
                <p>Company Name: </p>
                <p className="capitalize">{company.name.toLowerCase()}</p>
            </div>
            <div className="text-sm text-gray-600 grid grid-cols-2">
                <p>Email: </p>
                <p className="text-primary-500">{company.email}</p>
            </div>
            <div className="text-sm text-gray-600 grid grid-cols-2">
                <p>Phone: </p>
                <p className="">{company.phoneNo ?? '-'}</p>
            </div>
            <div className="text-sm text-gray-600 grid grid-cols-2">
                <p>Country: </p>
                <p className="">{company.country ?? '-'}</p>
            </div>
            <div className="text-sm text-gray-600 grid grid-cols-2">
                <p>Address: </p>
                <p className="">{[company.address, company.postcode, company.state].join(", ")}</p>
            </div></>
    )
}
