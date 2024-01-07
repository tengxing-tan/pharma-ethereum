'use server'

import prisma from "@/lib/prisma-client"

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
