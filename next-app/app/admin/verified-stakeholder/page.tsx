'use server'

import { getStakeholdersByVerified } from "@/app/api/action/getStakeholder"
import clsx from "clsx"
import Link from "next/link"

export default async function Page() {

    const stakeholders = await getStakeholdersByVerified(true)
    if (!stakeholders || stakeholders.length === 0) return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
            <p className="text-2xl text-gray-500 capitalize">
                🤖 No verified company yet.</p>
        </div>
    )

    return (
        <div className="bg-gray-50">
            <div className="min-h-screen w-full flex justify-center items-center p-20">
                <ul className="space-y-4">
                    {stakeholders?.map((item) => (
                        <li key={item.id} className="bg-white p-4 rounded-md shadow-md">
                            <Link href={`/admin/stakeholder/${item.id}`}>
                                <div className="flex space-x-2">
                                    {/* Stakeholder Role */}
                                    <p className="text-sm text-primary-500 font-semibold capitalize">
                                        {item.role.toLowerCase()}</p>
                                    <p className={clsx(
                                        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                                        item.isVerified ? "bg-green-50 text-green-700 ring-green-400" : "bg-rose-50 text-rose-700 ring-rose-400"
                                    )}>
                                        {item.isVerified ? "Verified" : "Unverified"}
                                    </p>
                                </div>
                                <p className="text-base text-gray-700 font-semibold">{item.name}</p>
                                <p className="text-sm text-primary-500">{item.email}</p>
                                <p className="text-sm text-gray-500">{item.createdAt.toDateString()}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}