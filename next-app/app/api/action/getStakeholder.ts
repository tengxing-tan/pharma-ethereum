import prisma from 'lib/prisma-client'

export async function getStakeholders() {
    try {
        const data = await prisma.stakeholder.findMany({
            orderBy: {
                createdAt: 'desc'
            },
        });
        console.log('Get stakeholders OK!');

        return data;
    } catch (error) {
        console.error('Error fetching stakeholder:', error);
    }
}

export async function getStakeholdersByVerified(isVerified: boolean) {
    return await prisma.stakeholder.findMany({
        where: {
            isVerified: isVerified
        },
    })
}

export async function getManufacturers() {
    try {
        const data = await prisma.manufacturer.findMany({
            include: {
                info: true
            }
        })
        return data
    } catch (error) {
        console.error('Error fetching manufacturer:', error);
    }
}
export async function getStakeholdersByRole(role: string) {

    const data = (role === "MANUFACTURER") ? await prisma.manufacturer.findMany({
        include: {
            info: true
        }
    }) : (role === "IMPORTER") ? await prisma.importer.findMany({
        include: {
            info: true
        }
    }) : (role === "WHOLESALER") ? await prisma.wholesaler.findMany({
        include: {
            info: true
        }
    }) : null

    if (!data) {
        console.log("😇 Get stakeholders by role OK!")
    }

    return data
}
// trace, product-description
export async function getStakeholderById(id: string) {
    const data = await prisma.stakeholder.findUnique({
        where: { id: id },
    })
    console.log("😇 Get stakeholder by id OK! ", data?.id)
    return data
}
export async function getStakeholderByManufacturerId(id: string) {

    if (!id) return null

    const data = await prisma.manufacturer.findUnique({
        where: { id: id },
        select: {
            info: true
        }
    })

    console.log("😇 Get stakeholder by manufacturer id ok!")
    return data?.info
}
export async function getStakeholderByImporterId(id: string) {

    if (!id) return null

    const data = await prisma.importer.findUnique({
        where: { id: id },
        select: {
            info: true
        }
    })

    console.log("😇 Get stakeholder by importer id ok! ", data?.info.name)
    return data?.info
}
export async function getStakeholderByWholesalerId(id: string) {

    if (!id) return null

    const data = await prisma.wholesaler.findUnique({
        where: { id: id },
        select: {
            info: true
        }
    })

    console.log("😇 Get stakeholder by wholesaler id ok! ", data?.info.name)
    return data?.info
}

// profile
export async function getStakeholderByEmail(email: string) {

    if (!email) return null

    const data = await prisma.stakeholder.findUnique({
        where: { email: email },
    })

    console.log("😇 Get stakeholder by user id ok! \n User email: ", data?.email)
    return data
}
