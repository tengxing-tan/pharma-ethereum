import { getActivitiesByBatchNoProcessType } from "@/app/api/action/getActivities"
import { Role, Stakeholder } from "@prisma/client"

export default async function ScProcess({ props }: {
    props: {
        drugBatchId: number
        stakeholder: Stakeholder | null | undefined
        color: string
    }
}) {

    // Display "No process yet" if there is no stakeholder
    if (!props.stakeholder) return <NoProcess />

    // Get activities by batchNo and processType
    const activities = await getActivitiesByBatchNoProcessType(props.drugBatchId, props.stakeholder.role)

    // Display "No process yet" if there is no activity
    if (!activities || activities.length === 0) {
        return <NoProcess />
    }

    return (
        <div className="w-full">
            {
                activities.map((item: returnedData) => (
                    <div key={item.id} className="grid w-full grid-cols-1 pt-1 sm:grid-cols-5">
                        <p className={`${(props.color === "amber") ? "text-amber-500" : "text-emerald-500"}  w-full mt-4 p-2 font-bold sm:col-span-2 sm:pr-12 sm:text-right`}>
                            On {item.date}</p>
                        <div className={`${(props.color === "amber") ? "border-amber-500" : "border-emerald-500"} border-l-2 px-6 pt-6 sm:col-span-3`}>
                            <p className="pb-2 text-gray-600">
                                It was <span className="text-base font-semibold">{item.process.name}</span></p>
                            {item.description ? (
                                <p className="text-sm font-medium text-gray-600">
                                    Description: <span className="text-gray-800 text-base">{item.description}</span></p>
                            ) : null}
                            <p className="text-sm font-medium text-gray-600">
                                by <span className="text-gray-800 text-base capitalize">{props.stakeholder?.name.toLowerCase()}</span></p>
                            <p className="text-sm font-medium text-gray-600">
                                at <span className="text-gray-800 text-base ">{props.stakeholder?.country}</span></p>
                            <p className="text-sm font-medium text-gray-600">
                                Company address: <span className="text-gray-800 text-base">{props.stakeholder?.address}</span></p>
                            {item.company ? (
                                <p className="pt-4 text-sm font-medium text-gray-600">
                                    to: <span className="text-gray-800 text-base capitalize">{item.company?.toLowerCase()}</span></p>
                            ) : null}
                            {item.country ? (
                                <p className="text-sm font-medium text-gray-600">
                                    at: <span className="text-gray-800 text-base">{item.country}</span></p>
                            ) : null}
                            {item.address ? (
                                <p className="text-sm font-medium text-gray-600">
                                    Address: : <span className="text-gray-800 text-base">{item.address}</span></p>
                            ) : null}
                        </div>
                    </div>
                ))
            }
        </div >
    )
}

function NoProcess() {
    return (
        <div className="w-full flex flex-col items-center justify-center bg-gray-500/5 p-6">
            <p className="text-gray-600">No process yet</p>
        </div>
    )
}

type returnedData = {
    process: {
        id: number;
        stage: Role;
        name: string;
    };
} & {
    id: number;
    drugBatchId: number;
    processId: number;
    description: string | null;
    date: string;
    company: string | null;
    country: string | null;
    address: string | null;
}
