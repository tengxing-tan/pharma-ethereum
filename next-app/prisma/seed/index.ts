import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import { stakeholderSeeder } from './stakeholderSeeder'
import { drugSeeder } from './drugSeeder'
import { drugBatchSeeder } from './drugBatchSeeder'
import { processSeeder } from './processSeeder'

async function main() {
    await stakeholderSeeder(prisma)
    console.log('🌴 Stakeholders seeded.')

    await drugSeeder(prisma)
    console.log('🌴 Drugs seeded.')

    await processSeeder(prisma)
    console.log('🌴 Processes seeded.')

    await drugBatchSeeder(prisma)
    console.log('🌴 DrugBatches seeded.')
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
