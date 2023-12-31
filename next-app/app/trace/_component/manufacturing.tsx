import { getActivitiesByBatchNoProcessType } from '@/app/api/action/getActivities'
import { Role, Stakeholder } from '@prisma/client'

export default async function Manufacturing({ drugBatchId, manDate, manufacturer }:
    {
        drugBatchId: number,
        manDate: string,
        manufacturer: Stakeholder,
    }) {

    const activities = await getActivitiesByBatchNoProcessType(drugBatchId, 'MANUFACTURER')

    return (
        <div className="w-full">
            <div className="grid w-full grid-cols-1 sm:grid-cols-5" >
                <p className="text-primary-500 w-full p-2 font-bold sm:col-span-2 sm:pr-12 sm:text-right">
                    On {manDate}</p>
                <div className="border-primary-500 border-l-2 px-6 py-2 sm:col-span-3">
                    <p className="pb-2 text-gray-600">
                        It was <span className="text-base font-semibold text-primary-500">Manufactured</span></p>
                    <p className="text-sm font-medium text-gray-600">
                        by <span className="text-gray-800 text-base capitalize">{manufacturer.name.toLowerCase()}</span></p>
                    <p className="text-sm font-medium text-gray-600">
                        at <span className="text-gray-800 text-base ">{manufacturer.country}</span></p>
                    <p className="text-sm font-medium text-gray-600">
                        Company address: <span className="text-gray-800 text-base">{manufacturer.address}</span></p>
                </div>
            </div>

            {
                activities && activities.map((item: returnedData) => (
                    <div key={item.id} className="pb-4 grid w-full grid-cols-1 pt-1 sm:grid-cols-5">
                        <p className="text-primary-500 w-full mt-4 p-2 font-bold sm:col-span-2 sm:pr-12 sm:text-right">
                            On {item.date}</p>
                        <div className="border-primary-500 border-l-2 px-6 pt-6 sm:col-span-3">
                            <p className="pb-2 text-gray-600">
                                It was <span className="text-base font-semibold text-primary-500">{item.process.name}</span></p>
                            {item.description ? (
                                <p className="text-sm font-medium text-gray-600">
                                    Description: <span className="text-gray-800 text-base">{item.description}</span></p>
                            ) : null}
                            <p className="text-sm font-medium text-gray-600">
                                by <span className="text-gray-800 text-base capitalize">{item.company ? item.company : manufacturer.name.toLowerCase()}</span></p>
                            <p className="text-sm font-medium text-gray-600">
                                at <span className="text-gray-800 text-base ">{item.country ? item.country : manufacturer.country}</span></p>
                            <p className="text-sm font-medium text-gray-600">
                                Company address: <span className="text-gray-800 text-base">{item.address ? item.address : manufacturer.address}</span></p>
                        </div>
                    </div>
                ))
            }
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
