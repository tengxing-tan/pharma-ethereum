'use client'

import useEthereum from "../_hooks/exe-contract";

export default function VerifyForm({ stakeholderId, metaMaskAcc }: {
    stakeholderId: string,
    metaMaskAcc?: string

}) {
    const { verifyStakeholder } = useEthereum();

    const handleVerify = () => verifyStakeholder(metaMaskAcc, true)
    const handleReject = () => verifyStakeholder(metaMaskAcc, false)

    return (
        <div className="flex justify-end space-x-4">
            <button onClick={handleVerify} className="capitalize shadow p-2 text-sm font-bold text-primary-500 hover:text-primary-700 hover:bg-gray-100">
                Approve
            </button>
            <button onClick={handleReject} className="capitalize shadow p-2 text-sm font-bold text-rose-500 hover:text-rose-700 hover:bg-gray-100">
                Reject
            </button>
        </div>
    )
}
