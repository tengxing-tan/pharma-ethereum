'use server'

import prisma from "@/lib/prisma-client"
import { stakeholderContractWithSigned } from "@/lib/smart-contracts/const-variables"
import { ethers } from "ethers"
import { redirect } from "next/navigation"

export async function verifyStakeholder(formData: FormData) {

    const id = formData.get('stakeholderId')?.toString()
    const metaMaskAcc = formData.get('metaMaskAcc')?.toString()
    if (!id || !metaMaskAcc) return null

    // isVerified
    if (formData.get('verify') === "approve") {
        // Smart contract
        // stakeholderContractWithSigned.verifyStakeholder(metaMaskAcc, true, { value: ethers.parseEther("0.001") })

        // Prisma
        await prisma.stakeholder.update({
            where: { id: id },
            data: { isVerified: true }
        })
        console.log("😇 Approve stakeholder OK!")
        redirect('/admin?msg=approveSuccess')
    }

    // unverified
    if (formData.get('verify') === "reject") {
        await prisma.stakeholder.update({
            where: { id: id },
            data: { isVerified: false }
        })
        console.log("😇 Reject stakeholder OK!")
        redirect('/admin?msg=rejectSuccess')
    }
}