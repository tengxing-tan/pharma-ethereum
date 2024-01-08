'use client'

import { redirect, useRouter } from "next/navigation"

export default function VerifyForm({ metaMaskAcc, contractAdd }: {
    metaMaskAcc?: string,
    contractAdd: string
}) {

    const router = useRouter()
    if (typeof metaMaskAcc === 'undefined') return null

    if (typeof window.ethereum === 'undefined') {
        console.log('MetaMask not installed')
    }


    async function handleClick(verify: boolean) {
        console.log("handleClick")
        if (typeof metaMaskAcc === 'undefined') redirect('/admin?error=metamask-not-installed')
        // init contract
        // const provider = new ethers.BrowserProvider(window.ethereum)
        // const provider = new ethers.JsonRpcProvider(process.env.HARDHAT_RPC_URL)
        // const signer = await provider.getSigner(0)
        // const contract = new ethers.Contract(
        //     contractAdd,
        //     stakeholderAbi.abi,
        //     signer
        // )

        // // handle contract
        // const transaction = await contract.verifyStakeholder(
        //     metaMaskAcc,
        //     verify,
        // )
        // const receipt = await transaction.wait()
        // // console.log('Receipt: ', receipt)

        // if (!receipt || receipt.hash === 0) redirect('/admin?error=transaction-failed')
        // else {
        //     await updateStakeholderStatus(metaMaskAcc, verify, receipt.hash)
        //     router.refresh()
        // }
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
