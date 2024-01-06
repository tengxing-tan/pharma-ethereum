'use server'

import prisma from "@/lib/prisma-client";

export async function getProcesses() {
    return await prisma.process.findMany();
}
