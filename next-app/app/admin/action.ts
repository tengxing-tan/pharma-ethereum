'use server'

import prisma from "@/lib/prisma-client"
import { ethers } from "ethers"
import stakeholderJson from "@/_utils/Stakeholder.json";

export async function updateStakeholderStatus(
    metaMaskAccount: string,
    isVerified: boolean,
    transactionHash: string | null
) {
    if (!transactionHash) {
        console.log("No transaction hash")
        return null
    }
    await prisma.stakeholder.update({
        where: { metaMaskAcc: metaMaskAccount.toLowerCase() },
        data: {
            isVerified: isVerified,
            transactionHash: transactionHash
        },
    })
    console.log("🤠 Admin: verify stakeholder OK! hash: ", transactionHash)
}

export async function getUserByEthers(metaMaskAccount: string) {
    const provider = new ethers.JsonRpcProvider(process.env.HARDHAT_RPC_URL);
    const contract = new ethers.Contract(process.env.STAKEHOLDER_CONTRACT_ADDRESS ?? '', stakeholderJson.abi, provider);

    const tx = await contract.getStakeholder(metaMaskAccount);
    const user = {
        email: tx.email.toString(),
        metamaskAccount: tx.metamaskAccount.toString(),
        registeredAt: (!tx.registeredAt) ? null : new Date(Number(tx.registeredAt) * 1000).toString(),
        verifiedAt: (!tx.verifiedAt) ? null : new Date(Number(tx.verifiedAt) * 1000).toString(),
        isAuthentic: Boolean(tx.isAuthentic)
    }
    return user
}
