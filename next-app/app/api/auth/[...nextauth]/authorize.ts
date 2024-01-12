import { ethers } from "ethers";
import prisma from "lib/prisma-client";
import stakeholderJson from "@/_utils/Stakeholder.json";

export async function getUserByEmail(email: string) {
    const data = await prisma.stakeholder.findUnique({
        where: { email: email },
    })

    return data
}

export async function getUserByEthers(metaMaskAccount: string) {
    const provider = new ethers.JsonRpcProvider(process.env.HARDHAT_RPC_URL);
    const contract = new ethers.Contract(process.env.STAKEHOLDER_CONTRACT_ADDRESS ?? '', stakeholderJson.abi, provider);

    const tx = await contract.getStakeholder(metaMaskAccount);
    const user = {
        email: tx.email,
        metamaskAccount: tx.metamaskAccount,
        registeredAt: tx.registeredAt ? new Date(Number(tx.registeredAt) * 1000).toString() : null,
        verifiedAt: tx.verifiedAt ? new Date(Number(tx.verifiedAt) * 1000).toString() : null,
        isAuthentic: tx.isAuthentic
    }
    return user
}
