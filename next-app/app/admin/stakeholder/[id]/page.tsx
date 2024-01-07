import dynamic from "next/dynamic";
import DrugList from "../../_components/drug-list"
import StakeholderProfile from "../../_components/stakeholder-profile"

// import VerifyForm from "../../_components/form-verify"
// <VerifyForm/> is LazyComponent, so it will not be rendered on server-side
const DynamicVerifyForm = dynamic(() => import('../../_components/form-verify'), {
    ssr: false
});

export default function Page({ params, searchParams }: {
    params: {
        id: string
    },
    searchParams: {
        mm?: string
    }
}) {

    return (
        <div className="bg-gray-50">
            <div className="min-h-screen w-full flex flex-col p-12 space-y-6">
                <section id="stakeholder-profile">
                    <StakeholderProfile stakeholderId={params.id}>
                        <DynamicVerifyForm stakeholderId={params.id} metaMaskAcc={searchParams.mm} />
                    </StakeholderProfile>
                </section>

                <section id="registered-products">
                    <DrugList stakeholderId={params.id} />
                </section>
            </div>
        </div>
    )
}