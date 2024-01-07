'use client'

import { useEffect, useState } from "react"
import { updateStakeholderStatus } from "../action"
import { ethers } from "ethers"
import stakeholderAbi from "@/_utils/Stakeholder.json"

export default function VerifyForm({ metaMaskAcc, contractAdd }: {
    metaMaskAcc?: string,
    contractAdd: string
}) {

    if (typeof metaMaskAcc === 'undefined') return null

    useEffect(() => {
        if (typeof window.ethereum === 'undefined') {
            console.log('MetaMask not installed')
        }
    }, [])

    async function handleClick(verify: boolean) {
        if (typeof metaMaskAcc === 'undefined') return null
        // init contract
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(
            contractAdd,
            stakeholderAbi.abi,
            signer
        )

        // handle contract
        const transaction = await contract.verifyStakeholder(
            metaMaskAcc,
            verify,
            { value: ethers.parseEther("0") }
        )
        const receipt = await transaction.wait()
        console.log('Receipt: ', receipt)

        if (receipt.hash === 0) return
        else {
            await updateStakeholderStatus(metaMaskAcc, verify, receipt.hash)
        }
    }

    return (
        <div className="flex justify-end space-x-4">
            {/* <ApproveButton metaMaskExt={wallet} metaMaskAcc={metaMaskAcc} /> */}
            <button className="capitalize shadow p-2 text-sm font-bold text-primary-500 hover:text-primary-700 hover:bg-gray-100"
                onClick={async () => handleClick(true)}>
                Approve
            </button>
            <button className="capitalize shadow p-2 text-sm font-bold text-rose-500 hover:text-rose-700 hover:bg-gray-100"
                onClick={async () => handleClick(false)}>
                Reject
            </button>
        </div>
    )
}
