import DrugList from "../../_components/drug-list"
import StakeholderProfile from "../../_components/stakeholder-profile"

export default function Page({ params }: {
    params: {
        id: string
    }
}) {

    return (
        <div className="bg-gray-50">
            <div className="min-h-screen w-full flex flex-col p-12 space-y-6">
                <section id="stakeholder-profile">
                    <StakeholderProfile stakeholderId={params.id} />
                </section>

                <section id="registered-products">
                    <DrugList stakeholderId={params.id} />
                </section>
            </div>
        </div>
    )
}