'use server'

import { getStakeholderByEmail } from '@/app/api/action/getStakeholder';
import prisma from 'lib/prisma-client'
import { redirect } from 'next/navigation';
import { z } from 'zod';

export async function getAllDrugs() {
    try {
        const data = await prisma.drug.findMany();

        return {
            props: { data },
            revalidate: 60, // Optional: re-generate every 60 seconds
        };
    } catch (error) {
        console.log('Error: ', error);
    }
}

export async function createNewProduct(formData: FormData) {

    const validatedData = drugScheme.parse({
        name: formData.get('name'),
        registrationNo: formData.get('registrationNo'),
        activeIngredient: formData.get('activeIngredient'),
        dosageForm: formData.get('dosageForm'),
        consumerMedicineInfo: formData.get('consumerMedicineInfo'),
    });

    const email = formData.get('email')?.toString()
    if (!email) redirect('/product-catalogue?success=false')

    // then querying owner from database
    const owner = await getStakeholderByEmail(email)
    const ownerId = owner?.id ?? ''

    // get manufacturer id from form data
    const manufacturerId = formData.get('manufacturerId')?.toString()
    // console.log("Manufacturer id: ", manufacturerId)

    const data = await prisma.drug.create({
        data: {
            ...validatedData,
            ownerId: ownerId,
            manufacturerId: manufacturerId,
        }
    });

    redirect('/product-catalogue?success=true')
    //   return Response.json({ message: 'look good' })
}

const drugScheme = z.object({
    name: z.string().min(1),
    registrationNo: z.string().min(5),
    activeIngredient: z.string().min(1),
    dosageForm: z.string().min(1),
    consumerMedicineInfo: z.string(),
});
