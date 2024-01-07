'use server'

import { getStakeholders, getStakeholdersByRole } from "@/app/api/action/getStakeholder"
import clsx from "clsx"
import Link from "next/link"
import { getStakeholderOnEth } from "@/lib/smart-contracts/manage-stakeholders"
import { StakeholderObj } from "./stakeholder-profile"

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

    // get data from blockchain
    async function VerifyComponent({ metaMaskAcc }: { metaMaskAcc: string }) {
        const stakeholder: StakeholderObj = await getStakeholderOnEth(metaMaskAcc)
        const isVerified = stakeholder && stakeholder.isAuthentic === true

        return (
            <>
                <p className={clsx(
                    "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                    (isVerified) ? "bg-green-50 text-green-700 ring-green-400" : "bg-rose-50 text-rose-700 ring-rose-400"
                )}>
                    {isVerified ? "Verified" : "Unverified"}
                </p>
            </>
        )
    }


    return (
        <ul className="grid lg:grid-cols-2 gap-6 items-center">
            {!stakeholders
                ? <p className="text-center text-gray-500">No Stakeholder</p>
                : stakeholders.map((item) => (
                    <li key={item.id} className="bg-white p-4 rounded-md shadow-md">
                        <Link href={`/admin/stakeholder/${item.id}?mm=${item.metaMaskAcc}`}>
                            <div className="flex justify-between">
                                <div className="inline-flex space-x-2">
                                    {/* Stakeholder Role */}
                                    <p className="text-sm text-primary-500 font-semibold capitalize" >
                                        {item.role.toLowerCase()}</p >
                                    <VerifyComponent metaMaskAcc={item.metaMaskAcc} />
                                </div>
                                {/* date */}
                                <p className="text-xs text-gray-500">{item.createdAt.toDateString()}</p>
                            </div>
                            <p className="text-base text-gray-700 font-semibold">{item.name}</p>
                            <p className="text-sm text-primary-500">{item.email}</p>
                            <p className="mt-1 p-1 text-xs w-fit font-mono font-semibold rounded border border-gray-300 text-gray-500">🦊 {item.metaMaskAcc}</p>
                        </Link>
                    </li>
                ))}
        </ul>
    )
}
