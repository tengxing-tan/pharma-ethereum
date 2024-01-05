import { PrismaClient } from "@prisma/client";

export async function drugBatchSeeder(prisma: PrismaClient) {

    try {
        // Seed drugBatchs
        for (let i = 1; i <= 10; i++) {
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
                                stage: Role.MANUFACTURER,
                                process: Process.UNDERWENT_MIXING_ENCAPSULATION,
                                date: '1/5/2023',
                            },
                            {
                                stage: Role.MANUFACTURER,
                                process: Process.LABELLING_PACKAGING,
                                date: '2/1/2023',
                            },
                            {
                                stage: Role.IMPORTER,
                                process: Process.SHIPPED,
                                date: '3/12/2023',
                                country: 'Malaysia',
                                address: 'Alor Star, Kedah',
                                company: 'RANBAXY (MALAYSIA) SDN. BHD.',
                            },
                            {
                                stage: Role.WHOLESALER,
                                process: Process.STORE_IN_WAREHOUSE,
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

enum Role {
    SUPPLIER = "SUPPLIER",
    MANUFACTURER = "MANUFACTURER",
    IMPORTER = "IMPORTER",
    WHOLESALER = "WHOLESALER",
}

enum Process {
    // manufacturing & packaging
    UNDERWENT_MIXING_ENCAPSULATION = "UNDERWENT_MIXING_ENCAPSULATION",
    LABELLING_PACKAGING = "LABELLING_PACKAGING",
    // importer / warehousing
    READY_TO_SHIP = "READY_TO_SHIP",
    SHIPPED = "SHIPPED",
    STORE_IN_WAREHOUSE = "STORE_IN_WAREHOUSE",
    DELIVERED = "DELIVERED",
    REJECTED = "REJECTED",
    RETURNED = "RETURNED",
}
