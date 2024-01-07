import { PrismaClient } from "@prisma/client"

export async function stakeholderSeeder(prisma: PrismaClient) {

    try {
        enum Role {
            SUPPLIER = "SUPPLIER",
            MANUFACTURER = "MANUFACTURER",
            IMPORTER = "IMPORTER",
            WHOLESALER = "WHOLESALER"
        }

        await prisma.manufacturer.create({
            data: {
                id: "ranbaxy",
                info: {
                    create: {
                        id: "ranbaxy",
                        metaMaskAcc: "0x00",
                        name: "RANBAXY (MALAYSIA) SDN. BHD.",
                        phoneNo: `016-7891 0234`,
                        email: `ranbaxy@example.com`,
                        address: `1, bakong road`,
                        postcode: `50000`,
                        state: `Kuala Lumpur`,
                        country: `Malaysia`,
                        role: Role.MANUFACTURER,
                        isVerified: false,
                    }
                }
            }
        })
        await prisma.importer.create({
            data: {
                id: "medispec",
                info: {
                    create: {
                        metaMaskAcc: "0x01",
                        name: "MEDISPEC(M) SDN.BHD",
                        phoneNo: `016-7891 0267`,
                        email: `medispec@example.com`,
                        address: `1, dahlia road`,
                        postcode: `22600`,
                        state: `Pahang`,
                        country: `Malaysia`,
                        role: Role.IMPORTER,
                        isVerified: false,
                    }
                }
            }
        })
        await prisma.wholesaler.create({
            data: {
                id: "jj",
                info: {
                    create: {
                        metaMaskAcc: "0x02",
                        name: "JOHNSON & JOHNSON SDN BHD",
                        phoneNo: `016-7891 0296`,
                        email: `jj@example.com`,
                        address: `1, setia indah road`,
                        postcode: `62600`,
                        state: `Johor`,
                        country: `Malaysia`,
                        role: Role.WHOLESALER,
                        isVerified: false,
                    }
                }
            }
        })
        await prisma.stakeholder.createMany({
            data: [{
                id: "tengxing",
                metaMaskAcc: "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
                name: "TAN SDN BHD",
                email: "tantengxing@email.com",
                country: "Malaysia",
                role: Role.SUPPLIER,
                isVerified: false,
            },
                // {
                //     name: "ABANG ADIK SDN BHD",
                //     email: "abangadik@example.com",
                //     country: "Malaysia",
                //     role: Role.SUPPLIER,
                //     isVerified: false,
                // }, {
                //     name: "LABORATORIES TORRENT (MALAYSIA) SDN. BHD.",
                //     email: "laboratoriestorrent@example.com",
                //     country: "Malaysia",
                //     role: Role.SUPPLIER,
                //     isVerified: false,
                // }
            ]
        })
        await prisma.admin.createMany({
            data: [
                { email: "admin@admin.com" },
            ]
        })

    } catch (error) {
        console.error('Error seeding database:', error);
    }
}
