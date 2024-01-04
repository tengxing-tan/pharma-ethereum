import StakeholderList from "../_components/stakeholder-list";

export default function Page({ params }: {
    params: {
        stakeholderRole: string
    }
}) {

    const role = params.stakeholderRole.slice(0, -1).toUpperCase()

    return (
        <div className="bg-gray-50">
            <div className="min-h-screen w-full p-20">
                <StakeholderList role={role} />
            </div>
        </div>
    )
}