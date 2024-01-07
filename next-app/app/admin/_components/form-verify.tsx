'use client'

import { useEffect, useState } from "react"
import { updateStakeholderStatus } from "../action"
import stakeholderAbi from "@/_utils/Stakeholder.json"
import { ethers } from "ethers"
const STAKEHOLDER_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

export default function VerifyForm({ metaMaskAcc }: {
    metaMaskAcc?: string
}) {

    if (typeof metaMaskAcc === 'undefined') return null
    const [transaction, setTransaction] = useState<boolean | null>(null)

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
            STAKEHOLDER_CONTRACT_ADDRESS,
            stakeholderAbi.abi,
            signer
        )
        // handle contract
        const transaction = await contract.verifyStakeholder(
            metaMaskAcc,
            verify,
            { value: ethers.parseEther("0") })
        const receipt = await transaction.wait()

        if (receipt.hash === 0) setTransaction(false)
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
