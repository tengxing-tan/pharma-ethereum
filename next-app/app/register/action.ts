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
const STAKEHOLDER_CONTRACT_ADDRESS = "0xc351628EB244ec633d5f21fBD6621e1a683B1181"

const provider = new ethers.JsonRpcProvider(RPC_URL);
const contractAddress = STAKEHOLDER_CONTRACT_ADDRESS;

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
        console.error("💩 Bad news! ", error)
    }
    return true
}

export async function createStakeholder(formData: FormData) {

    const validEmail = emailSchema.parse(formData.get('email'));
    const validMetaMaskAccount = metaMaskAccountSchema.parse(formData.get('metaMaskAccount'));
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
        console.log('Error: ', error);
    }
    redirect(`#`)
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
