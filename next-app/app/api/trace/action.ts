import prisma from "@/lib/prisma-client"

export async function getDrugBatch(batchNo: string) {
    const result = await prisma.drugBatch.findUnique({
        where: {
            batchNo: batchNo
        },
        include: {
            drug: {
                include: {
                    owner: true,
                    manufacturer: { include: { info: true } }
                }
            },
            activities: true,
        }
    })
    return result
}

export async function getStakeholders(stakeholderId: string) {
    const result = await prisma.stakeholder.findUnique({
        where: {
            id: stakeholderId
        },
    })
    return result
}
