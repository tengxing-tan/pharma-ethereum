import { PrismaClient, Role } from "@prisma/client";

export async function processSeeder(prisma: PrismaClient) {
    // create process type
    try {
        await prisma.process.createMany({
            data: [
                {
                    stage: Role.MANUFACTURER,
                    name: 'Underwent Mixing & Encapsulation',
                },
                {
                    stage: Role.MANUFACTURER,
                    name: 'Labelling & Packaging',
                },
                {
                    stage: Role.IMPORTER,
                    name: 'Ready to Ship',
                },
                {
                    stage: Role.IMPORTER,
                    name: 'Shipped',
                },
                {
                    stage: Role.IMPORTER,
                    name: 'Store in Warehouse',
                },
                {
                    stage: Role.IMPORTER,
                    name: 'Delivered',
                },
                {
                    stage: Role.IMPORTER,
                    name: 'Rejected',
                },
                {
                    stage: Role.IMPORTER,
                    name: 'Returned',
                },
            ]
        })
    } catch (error) {
        console.error('Error seeding process types in the database:', error);
    }
}