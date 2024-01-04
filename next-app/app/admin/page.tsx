import StakeholderList from "./_components/stakeholder-list";

export default function AdminPage({ searchParams }: {
    searchParams: {
        msg: string
    }
}) {

    return (
        <div className="bg-gray-50 min-h-screen w-full p-20">
            {(searchParams.msg === 'rejectSuccess') ? (
                <div className="pb-4">
                    <p className="bg-white rounded border-2 border-rose-300 text-gray-800 w-fit p-2">😉 Stakeholder rejected successfully!</p>
                </div>
            ) : null}
            <StakeholderList />
        </div>
    )
}