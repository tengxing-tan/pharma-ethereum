'use server'

import { getStakeholders, getStakeholdersByRole } from "@/app/api/action/getStakeholder"
import clsx from "clsx"
import Link from "next/link"

export default async function StakeholderList({ role }: {
    role?: string
}) {

    let stakeholdersWithRole = null
    if (role) {
        stakeholdersWithRole = await getStakeholdersByRole(role)
    }
    const stakeholders = (stakeholdersWithRole)
        ? stakeholdersWithRole.map((item) => (item.info))
        : await getStakeholders()

    return (
        <ul className="grid lg:grid-cols-2 gap-6 items-center">
            {stakeholders?.map((item) => (
                <li key={item.id} className="bg-white p-4 rounded-md shadow-md">
                    <Link href={`/admin/stakeholder/${item.id}`}>
                        <div className="flex justify-between">
                            <div className="inline-flex space-x-2">
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
                            {/* date */}
                            <p className="text-xs text-gray-500">{item.createdAt.toDateString()}</p>
                        </div>
                        <p className="text-base text-gray-700 font-semibold">{item.name}</p>
                        <p className="text-sm text-primary-500">{item.email}</p>
                    </Link>
                </li>
            ))}
        </ul>
    )
}
