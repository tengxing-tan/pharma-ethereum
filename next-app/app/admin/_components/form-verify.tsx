'use client'

import { ethers } from "ethers"
import stakeholderJson from "@/_utils/Stakeholder.json";
import { redirect, useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { updateStakeholderStatus } from "../action";

export default function VerifyForm({ metaMaskAcc, contractAdd }: {
    metaMaskAcc?: string,
    contractAdd: string
}) {

    const router = useRouter()
    const [loading, setLoading] = useState(false)

    if (typeof metaMaskAcc === 'undefined') return null

    async function handleClick(verify: boolean) {
        setLoading(true)
        console.log("handleClick")

        if (typeof metaMaskAcc === 'undefined') redirect('/admin?error=metamask-not-found')
        // init contract
        // const provider = new ethers.BrowserProvider(window.ethereum)
        const provider = (typeof window.ethereum === 'undefined')
            ? new ethers.JsonRpcProvider(process.env.HARDHAT_RPC_URL)
            : new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()

        const contract = new ethers.Contract(
            contractAdd,
            stakeholderJson.abi,
            signer
        )

        // // handle contract
        try {
            const transaction = await contract.verifyStakeholder(
                metaMaskAcc,
                verify,
            )
            const receipt = await transaction.wait()
            // mysql
            updateStakeholderStatus(
                metaMaskAcc,
                verify,
                receipt.hash
            )
        } catch (error) {
            console.log("Something went wrong: ", error)
        }

        setLoading(false)
        router.refresh()
    }

    return (
        <div className="flex justify-end space-x-4">
            {loading && (
                <div className="bg-gray-800/80 absolute top-0 bottom-0 left-0 right-0">
                    <div className="w-full h-screen flex justify-center items-center">
                        <p className="text-2xl text-white">
                            Updating to blockchain...
                        </p>
                    </div>
                </div>
            )}

            {/* <ApproveButton metaMaskExt={wallet} metaMaskAcc={metaMaskAcc} /> */}
            <button className="capitalize shadow p-2 text-sm font-bold text-primary-500 hover:text-primary-700 hover:bg-gray-100 focus:ring-2 focus:ring-primary-400"
                onClick={async () => handleClick(true)}>
                Approve
            </button>
            <button className="capitalize shadow p-2 text-sm font-bold text-rose-500 hover:text-rose-700 hover:bg-gray-100 focus:ring-2 focus:ring-rose-400"
                onClick={async () => handleClick(false)}>
                Reject
            </button>
        </div>
    )
}
