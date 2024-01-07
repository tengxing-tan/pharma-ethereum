'use server'
import { Role } from '@prisma/client'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import prisma from '@/lib/prisma-client';
// for smart contract

import { getNow, getSignedShContract, stakeholderContract } from '@/lib/smart-contracts/const-variables';
import { getStakeholderByEmail } from '../api/action/getStakeholder';

// Get stakeholer from Ethereum
const isRegistered = async (metaMaskAccount: string, email: string) => {

    // check if stakeholder is stored on database
    const onRdbms = await getStakeholderByEmail(email)
    if (onRdbms) {
        console.log("💩 Ouhhhh! Email had already used.")
        return true
    }

    // Check if stakeholder is stored on Ethereum
    try {
        // Get stakeholder from ethereum
        const onEthereum = await stakeholderContract.getStakeholder(metaMaskAccount)

        // Email existed on Ethereum
        if (onEthereum.email) {
            console.log("💩 Ouhhhh! MetaMask account had already used.")
            return true
        }
    } catch (error) {
        console.error(`💩 Ouhhhh! Cannot retrieve stakeholder on ethereum. 
        You are using wrong MetaMask account.`)
    }

    // account haven't taken
    return false
}

// Store stakeholder on Ethereum
export const storeOnEthereum = async (
    email: string,
    metaMaskAccount: string
) => {

    const currentTimestamp = getNow()
    try {
        const contract = await getSignedShContract()
        const transaction = await contract.addStakeholder(
            email,
            metaMaskAccount,
            currentTimestamp,
        )

        const transactionHash = transaction.hash
        console.log("🚀 Store on Ethereum! Transaction hash: ", transaction.hash);

        return transactionHash
    } catch (error) {
        console.log(error)
        console.log("💩 Ouhhhh! Cannot store data on Ethereum....\n  Check your MetaMaskAccount...")
        return null
    }
}

export async function createStakeholder(formData: FormData) {

    const validEmail = emailSchema.parse(formData.get('email'));
    const validMetaMaskAccount = metaMaskAccountSchema.parse(formData.get('metaMaskAccount'));

    // check is stakeholder existed
    const accHadTaken = await isRegistered(validMetaMaskAccount, validEmail)
    if (accHadTaken) {
        console.log(`
            Given email: ${validEmail}
            Given MetaMask account: ${validMetaMaskAccount}
            `)
        console.log("🤖 System will not register this account. Try again with another email or MetaMask account.")
        redirect(`?msg=accHadTaken`)
    }

    // store stakeholder on Ethereum
    const transactionHash = await storeOnEthereum(validEmail, validMetaMaskAccount)
    if (!transactionHash) {
        console.error("💩 Ouhhhh! Ethereum transaction failed")
        redirect(`?msg=error`)
    }

    // store stakeholder on database RDBMS
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
                metaMaskAcc: validMetaMaskAccount,
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
        if (error instanceof z.ZodError) {
            console.log(error.issues);
        }
        redirect(`?msg=error`)
    }
    redirect(`?msg=success`)
}

const schema = z.object({
    name: z.string().min(1),
    phoneNo: z.string().min(1),
    email: z.string().min(1),
    address: z.string(),
    postcode: z.string(),
    state: z.string(),
    country: z.string().min(1),
    role: z.enum([Role.SUPPLIER, Role.IMPORTER, Role.MANUFACTURER, Role.WHOLESALER]),
});

const emailSchema = z.string().email().min(1);
const metaMaskAccountSchema = z.string().min(42);
