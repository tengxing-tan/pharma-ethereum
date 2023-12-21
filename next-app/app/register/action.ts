'use server'
import { PrismaClient, Role } from '@prisma/client'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
const prisma = new PrismaClient()
import { z } from 'zod';

export async function createStakeholder(formData: FormData) {

    try {
        const validatedData = schema.parse({
            name: formData.get('name'),
            phoneNo: formData.get('phoneNo'),
            email: formData.get('email'),
            address: formData.get('address'),
            postcode: formData.get('postcode'),
            state: formData.get('state'),
            country: formData.get('country'),
            role: formData.get('role'),
        });
        const data = await prisma.stakeholder.create({
            data: {
                ...validatedData
            },
        });

        const role = validatedData.role
        if (role === Role.IMPORTER) {
            await prisma.importer.create({
                data: {
                    stakeholderId: data.id,
                }
            })
            console.log('😇 Added to importer table')
        } else if (role === Role.MANUFACTURER) {
            await prisma.manufacturer.create({
                data: {
                    stakeholderId: data.id,
                }
            })
            console.log('😇 Added to manufacturer table')
        } else if (role === Role.WHOLESALER) {
            await prisma.wholesaler.create({
                data: {
                    stakeholderId: data.id,
                }
            })
            console.log('😇 Added to wholesaler table')
        }

        console.log('😇 Create stakeholder ok! stakeholder id: ', data.id);
        revalidatePath('/register')
    } catch (error) {
        console.log('Error: ', error);
    }
    redirect(`#`)
}

const schema = z.object({
    name: z.string().min(1),
    phoneNo: z.string().min(1),
    email: z.string().min(1),
    address: z.string().min(1),
    postcode: z.string(),
    state: z.string(),
    country: z.string().min(1),
    role: z.string().min(1),
});
