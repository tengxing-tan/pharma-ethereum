import { validateMetaMaskAccount } from "@/lib/smart-contracts/manage-stakeholders";
import prisma from "lib/prisma-client";

export async function getUserByEmail(email: string) {
    const data = await prisma.stakeholder.findUnique({
        where: { email: email },
    })

    return data
}

export async function getUserByEthers(metaMaskAccount: string) {
    return await validateMetaMaskAccount(metaMaskAccount);
}