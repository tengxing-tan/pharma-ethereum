'use server'
import prisma from 'lib/prisma-client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export async function updateStakeholder(formData: FormData) {
    const validatedData = schema.parse({
        name: formData.get('name')?.toString().toUpperCase(),
        phoneNo: formData.get('phoneNo'),
        address: formData.get('address'),
        postcode: formData.get('postcode'),
        state: formData.get('state'),
        country: formData.get('country'),
    });
    const stakeholderId = z.string().min(1).parse(formData.get('id'))
    await prisma.stakeholder.update({
        where: {
            id: stakeholderId,
        },
        data: validatedData
    })
    console.log('😇 Update stakeholder ok! stakeholder id: ', stakeholderId);
    revalidatePath('/profile')
    redirect('profile?msg=success')
}

const schema = z.object({
    name: z.string().min(1),
    phoneNo: z.string().min(1),
    address: z.string(),
    postcode: z.string(),
    state: z.string(),
    country: z.string().min(1),
});
