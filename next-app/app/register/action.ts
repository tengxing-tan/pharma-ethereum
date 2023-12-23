'use server'
import { Role } from '@prisma/client'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import prisma from '@/lib/prisma-client';
// for smart contract
import { ethers } from 'ethers';
import stakeholderAbi from "@/_utils/Stakeholder.json"

const RPC_URL = "http://127.0.0.1:8545"
const STAKEHOLDER_CONTRACT_ADDRESS = "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE"

const provider = new ethers.JsonRpcProvider(RPC_URL);
const contractAddress = STAKEHOLDER_CONTRACT_ADDRESS;

// Get stakeholer from Ethereum
const isRegistered = async (metaMaskAccount: string, email: string) => {

    if (typeof contractAddress === 'undefined') return false

    // check if stakeholder is stored on database
    const accRegisteredOnDatabase = await prisma.stakeholder.findUnique({
        where: {
            email: email
        }
    })
    if (accRegisteredOnDatabase) {
        console.log("💩 Bad news! Entered email had been registered on database.")
        return true
    }

    // Check if stakeholder is stored on Ethereum
    const contract = new ethers.Contract(contractAddress, stakeholderAbi.abi, provider);
    try {
        const stakeholder = await contract.getStakeholder(metaMaskAccount)
        if (stakeholder.email) {
            console.log("💩 Bad news! Entered Metamask had been registered on Ethereum.")
            return true
        }
        if (email === stakeholder.email) {
            console.log("💩 Bad news! Entered email had been registered on Ethereum.")
            return true
        }
        return false
    } catch (error) {
        console.error(`💩 Bad news! Cannot retrieve stakeholder on ethereum. 
        You are using wrong MetaMask account.`)
        return false
    }
}

// Store stakeholder on Ethereum
export const storeOnEthereum = async (
    email: string,
    metaMaskAccount: string
) => {
    if (typeof contractAddress === 'undefined') {
        console.error("Contract address is undefined")
        return false
    }

    const signer = await provider.getSigner(); // Get the account that will sign the transaction
    const contract = new ethers.Contract(contractAddress, stakeholderAbi.abi, signer);
    // console.log("Debugging signer & contract: ", signer, contract)
    const timestamp = new Date()

    try {
        const transaction = await contract.addStakeholder(
            email,
            metaMaskAccount,
            Date.parse(timestamp.toString()),
        )
        // await transaction.wait(); // Wait for the transaction to be mined
        console.log("🚀 Store on Ethereum! Transaction hash: ", transaction.hash);
    } catch (error) {
        console.log(error)
        console.log("💩 Bad news! Cannot store data on Ethereum....\n  Check your MetaMaskAccount...")
    }
    return true
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

    const hadStoredOnEthereum = await storeOnEthereum(validEmail, validMetaMaskAccount)
    if (!hadStoredOnEthereum) {
        console.error("💩 Bad news! Ethereum transaction failed")
    }

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
