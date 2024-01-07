'use client'

import { useEffect, useState } from "react"
// import { verifyStakeholder } from "../action"
import stakeholderAbi from "@/_utils/Stakeholder.json"
import { ethers } from "ethers"
const STAKEHOLDER_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

export default function VerifyForm({ metaMaskAcc }: {
    metaMaskAcc?: string
}) {

    if (typeof metaMaskAcc === 'undefined') return null
    // const [wallet, setWallet] = useState<string>('')

    useEffect(() => {
        if (typeof window.ethereum === 'undefined') {
            console.log('MetaMask not installed')
        }
    }, [])

    const ethereum = { request: () => window.ethereum.request }

    return (
        <div className="flex justify-end space-x-4">
            {/* <ApproveButton metaMaskExt={wallet} metaMaskAcc={metaMaskAcc} /> */}
            <button className="capitalize shadow p-2 text-sm font-bold text-primary-500 hover:text-primary-700 hover:bg-gray-100"
                onClick={async () => {
                    const provider = new ethers.BrowserProvider(window.ethereum)
                    const signer = await provider.getSigner()
                    const contract = new ethers.Contract(
                        STAKEHOLDER_CONTRACT_ADDRESS,
                        stakeholderAbi.abi,
                        signer
                    )
                    // handle contract
                    const receipt = await contract.verifyStakeholder(
                        metaMaskAcc,
                        true,
                        { value: ethers.parseEther("0") })
                    console.log('settle approve')
                }}>
                Approve
            </button>
        </div>
    )
}
