'use server'

import { getStakeholderById } from "@/app/api/action/getStakeholder"
import { getStakeholderOnEth } from "@/lib/smart-contracts/manage-stakeholders"
import clsx from "clsx"

export default async function StakeholderProfile({ stakeholderId, children }: {
    stakeholderId: string,
    children: React.ReactNode | null
}) {

    const profile = await getStakeholderById(stakeholderId)
    if (!profile) return null

    // Ethereum
    const stakeholderOnEth: StakeholderObj = await getStakeholderOnEth(profile.metaMaskAcc)
    const isVerified = stakeholderOnEth && stakeholderOnEth.isAuthentic

    return (
        <div className="bg-white w-full p-4 rounded shadow">
            {/* Stakeholder Role */}
            <p className="text-sm text-purple-500 font-semibold capitalize">
                {profile.role.toLowerCase()}</p>
            <div className="flex space-x-2 pb-2">
                {/* Company name */}
                <p className="text-lg text-gray-800 font-semibold">
                    {profile.name}</p>
            </div>
            <div className="space-y-2">
                <h3 className="text-xs text-gray-700 font-bold">Data on Blockchain: </h3>
                <div className="font-mono text-xs text-gray-500">
                    <div className="grid grid-cols-3">
                        {/* Blockchain data */}
                        <p>&gt; MetaMask Account (Public Key)</p>
                        {/* MetaMask account */}
                        <code className="text-gray-700 col-span-2">
                            {stakeholderOnEth && stakeholderOnEth.metamaskAccount !== ''
                                ? stakeholderOnEth.metamaskAccount
                                : 'no data'}
                        </code>
                        {/* Verified status */}
                        <p>&gt; Authenticity</p>
                        <code className={clsx(
                            "col-span-2 w-fit rounded font-bold",
                            isVerified ? "text-green-500" : "text-rose-500"
                        )}>
                            {isVerified ? "Verified" : "Unverified"}
                        </code>
                        {/* Email */}
                        <p>&gt; Email</p>
                        <code className="text-primary-500 col-span-2">
                            {stakeholderOnEth && stakeholderOnEth.email !== ''
                                ? stakeholderOnEth.email
                                : 'no data'}
                        </code>
                        {/* verfied at */}
                        <p>&gt; Registered At</p>
                        <code className="text-gray-700 col-span-2">
                            {stakeholderOnEth && Number(stakeholderOnEth.registeredAt) !== 0
                                ? new Date(Number(stakeholderOnEth.registeredAt) * 1000).toString()
                                : 'no data'
                            }</code>
                        {/* verfied at */}
                        <p>&gt; Verfied At</p>
                        <code className="text-gray-700 col-span-2">
                            {stakeholderOnEth && Number(stakeholderOnEth.verifiedAt) !== 0
                                ? new Date(Number(stakeholderOnEth.verifiedAt) * 1000).toString()
                                : 'no data'
                            }</code>
                        {/* transaction hash */}
                        <p>&gt; Transaction hash</p>
                        <code className="text-gray-700 col-span-2">
                            {profile.transactionHash ?? 'no data'}</code>
                    </div>
                </div>
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
                </div>
            </div>

            {children}
        </div>
    )
}

type StakeholderObj = {
    email: string;
    metamaskAccount: string;
    registeredAt: number | null;
    verifiedAt: number | null;
    isAuthentic: boolean;
}
