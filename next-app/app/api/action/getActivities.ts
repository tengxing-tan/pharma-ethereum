import prisma from "lib/prisma-client";

export async function getActivitiesByBatchId(batchId: number) {
    const data = await prisma.productStatus.findMany({
        where: { drugBatchId: batchId },
    })

    console.log("😇 Get activities by batch id ok!")
    return data
}
