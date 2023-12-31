import { PrismaClient } from "@prisma/client";

export async function drugBatchSeeder(prisma: PrismaClient) {

    try {
        // Seed drugBatchs
        for (let i = 1; i <= 50; i++) {
            await prisma.drugBatch.create({
                data: {
                    drugId: i % 22 + 1,
                    batchNo: new Date().toISOString().substring(0, 10).split('-').join('').concat(i.toString()),
                    quantity: Math.floor(Math.random() * 1000) + 1, // Random quantity
                    manufactureDate: `2023-11-01`, // Random MM/YY format
                    expiryDate: `2025-11-01`, // Random MM/YY format
                    importerId: 'medispec',
                    wholesalerId: 'jj',
                    activities: {
                        create: [
                            {
                                processId: 1,
                                date: '1/5/2023',
                            },
                            {
                                processId: 2,
                                date: '2/1/2023',
                            },
                            {
                                processId: 4,
                                date: '3/12/2023',
                                country: 'Malaysia',
                                address: 'Alor Star, Kedah',
                                company: 'RANBAXY (MALAYSIA) SDN. BHD.',
                            },
                            {
                                processId: 5,
                                date: '4/1/2023',
                            },
                        ],
                    }
                },
            });
        }
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}
