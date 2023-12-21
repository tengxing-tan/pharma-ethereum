'use server';

import prisma from 'lib/prisma-client'
import { redirect } from 'next/navigation';
import { z } from 'zod';

export async function createDrugBatch(formData: FormData) {

    const validated = createBatchSchema.parse({
        batchNo: formData.get('batchNo'),
        quantity: Number(formData.get('quantity')),
        manufactureDate: formData.get('manufactureDate'),
        expiryDate: formData.get('expiryDate'),
    });
    const regNoSchema = z.string().min(5);
    regNoSchema.parse(formData.get('registrationNo'))

    // valid drug registration no
    const drug = await prisma.drug.findUnique({
        where: {
            registrationNo: regNoSchema.parse(formData.get('registrationNo'))
        }
    })

    if (drug?.id) {
        await prisma.drugBatch.create({
            data: {
                ...validated,
                drugId: drug.id,
            },
        });
    } else { console.log('searching drug by registration no. But Drug not found!') }

    console.log("Drug Batch created ok!")
    redirect(`?created=ok`);
}
// order/batchNo: get basic details
export async function getDrugBatch(id: number) {
    const data = await prisma.drugBatch.findUnique({
        where: {
            id: id
        }
    })
    return data
}
// order/batchNo: update basic details
export async function updateBasicDetails(formData: FormData) {
    const batchId = Number(formData.get('batchId'));
    const basicData = basicScheme.parse({
        quantity: Number(formData.get('quantity')), // becuase form data returns string
        manufactureDate: formData.get('manufactureDate'),
        expiryDate: formData.get('expiryDate'),
    })
    const result = await prisma.drugBatch.update({
        where: {
            id: batchId
        },
        data: {
            ...basicData
        }
    });
    console.log("🐸 Update basic details ok!")
    redirect(`?updated=basicOk`);
}
// order/batchNo: update shipment process
export async function updateShipmentProcess(formData: FormData) {
    if (!formData) return null

    const batchId = Number(formData.get('batchId'));

    if (formData.get('stage') === 'IMPORTER' || formData.get('stage') === 'WHOLESALER') {
        const drugBatch = await prisma.drugBatch.findUnique({
            where: {
                id: batchId
            },
            select: {
                importerId: true,
                wholesalerId: true,
            }
        })
        if (drugBatch?.importerId === null) {
            redirect(`?updated=error&form=shipment-importer`);
        }
        if (drugBatch?.wholesalerId === null) {
            redirect(`?updated=error&form=shipment-wholesaler`);
        }
    }

    const validedProductStatus = productStatusSchema.parse({
        date: formData.get('date'),
        description: formData.get('description'),
        company: formData.get('company'),
        address: formData.get('address'),
        country: formData.get('country'),
    });

    await prisma.productStatus.create({
        data: {
            ...validedProductStatus,
            stage: formData.get('stage'), // run as expected, can be fixed later
            process: formData.get('process'),
            drugBatch: { connect: { id: batchId } },
        },
    });

    console.log('🐸 update shipment ok');
    redirect(`?updated=shipmentOk`);
}

// order/batchNo: update stakeholder
export async function updateStakeholder(formData: FormData) {
    const batchId = Number(formData.get('batchId'));
    try {
        stakeholderSchema.parse({
            importer: formData.get('importer'),
            wholesaler: formData.get('wholesaler'),
        });
    } catch (error) {
        console.log('Error: ', error);
    }

    const importerId = formData.get('importerId')?.toString();
    const wholesalerId = formData.get('wholesalerId')?.toString();

    if (importerId && importerId !== '') {
        await prisma.drugBatch.update({
            where: { id: batchId },
            data: { importer: { connect: { id: importerId } } }
        });
        console.log("🐸 Update importer ok!")
    }

    if (wholesalerId && wholesalerId !== '') {
        await prisma.drugBatch.update({
            where: { id: batchId },
            data: { wholesaler: { connect: { id: wholesalerId } } }
        });
        console.log("🐸 Update wholesaler ok!")
    }

    redirect(`?updated=stakeholderOk`);
}

export async function deleteDrugBatch(formData: FormData) {
    const batchId = Number(formData.get('batchId'));

    try {
        await prisma.productStatus.deleteMany({
            where: {
                drugBatchId: batchId
            }
        })
        await prisma.drugBatch.delete({
            where: {
                id: batchId
            },
        });
        console.log("💩 Delete drug batch ok!")
    } catch (error) {
        console.log('Error: ', error);
    }

    redirect(`/order?action=deleteOk`);
}

const createBatchSchema = z.object({
    batchNo: z.string().min(1),
    quantity: z.number().min(0),
    manufactureDate: z.string().min(1),
    expiryDate: z.string().min(1),
});

const basicScheme = z.object({
    quantity: z.number().min(1),
    manufactureDate: z.string().min(1),
    expiryDate: z.string().min(1),
});

const productStatusSchema = z.object({
    date: z.string(),
    description: z.string(),
    company: z.string(),
    address: z.string(),
    country: z.string(),
})

const stakeholderSchema = z.object({
    importer: z.string().min(1),
    wholesaler: z.string().min(1),
})
