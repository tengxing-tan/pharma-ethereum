'use server'

import prisma from "@/lib/prisma-client"
import { redirect } from "next/navigation"

export async function verifyStakeholder(formData: FormData) {

    const id = formData.get('stakeholderId')?.toString()
    if (!id) return null

    // isVerified
    if (formData.get('verify') === "approve") {
        // TODO Smart contract

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