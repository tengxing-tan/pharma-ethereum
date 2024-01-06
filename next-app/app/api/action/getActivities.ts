import { Role } from "@prisma/client";
import prisma from "lib/prisma-client";

export async function getActivitiesByBatchNoProcessType(drugBatchId: number, processType: Role) {
    const data = await prisma.activity.findMany({
        where: {
            drugBatchId: drugBatchId,
            process: {
                stage: Role[processType]
            }
        },
        include: { process: true },
    })

    console.log("😇 Get activities by batch id ok!", data)
    return data
}
