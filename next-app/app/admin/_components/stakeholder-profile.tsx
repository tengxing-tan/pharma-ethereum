'use server'

import { getStakeholderById } from "@/app/api/action/getStakeholder"
import clsx from "clsx"

export default async function StakeholderProfile({ stakeholderId, children }: {
    stakeholderId: string,
    children?: React.ReactNode | null
}) {

    const profile = await getStakeholderById(stakeholderId)
    if (!profile) return null

    // Ethereum
    const isVerified = true

    return (
        <div className="bg-white w-full p-4 rounded shadow">
            {/* Stakeholder Role */}
            <p className="text-sm text-purple-500 font-semibold capitalize">
                {profile.role.toLowerCase()}</p>
            <div className="flex space-x-2 pb-2">
                {/* Company name */}
                <p className="text-lg text-gray-800 font-semibold">
                    {profile.name}</p>
                {/* Verified status */}
                <p className={clsx(
                    "inline-flex items-center rounded-md px-2 py-0.5 text-sm font-medium ring-1 ring-inset",
                    isVerified ? "bg-green-50 text-green-700 ring-green-400" : "bg-rose-50 text-rose-700 ring-rose-400"
                )}>
                    {isVerified ? "Verified" : "Unverified"}
                </p>
            </div>
            <div className="space-y-2">
                <h3 className="text-xs text-gray-700 font-bold">Blockchain Info: </h3>
                {/* Blockchain data */}
                <p className="font-mono text-xs text-gray-500">
                    &gt; MetaMask Account (Public Key):&nbsp;
                    <code className="font-semibold">
                        {profile.metaMaskAcc}</code>
                </p>
                {/* transaction hash */}
                <p className="font-mono text-xs text-gray-500">
                    &gt; Transaction hash:
                </p>
                <div>
                    <h3 className="text-xs text-gray-700 font-bold">Contact: </h3>
                    <p className="text-sm text-primary-500">{profile.email}</p>
                    <p className="text-sm text-gray-500">{profile.phoneNo}</p>
                </div>
                <div>
                    <h3 className="text-xs text-gray-700 font-bold">Address: </h3>
                    <p className="text-sm text-gray-500">{profile.address}</p>
                    <p className="text-sm text-gray-500">{[profile.postcode, profile.state].join(" ")}</p>
                    <p className="text-sm text-gray-500">{profile.country}</p>
                </div>
                <div>
                    <h3 className="text-xs text-gray-700 font-bold">Timestamp: </h3>
                    <div className="text-sm text-gray-500 flex space-x-1">
                        <p>Registered at: </p>
                        <p className="text-gray-700">{profile.createdAt.toLocaleString()}</p>
                    </div>
                    {/* TODO: Ethereum */}
                    <div className="text-sm text-gray-500 flex space-x-1">
                        <p>Verified at: </p>
                        <p className="text-gray-700">{isVerified ? '2024' : 'unverfied'}</p>
                    </div>
                </div>
            </div>

            {children}
        </div>
    )
}