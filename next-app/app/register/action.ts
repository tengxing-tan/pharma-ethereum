'use server'
import { Role } from '@prisma/client'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import prisma from '@/lib/prisma-client';
// for smart contract
import { getNow } from '@/lib/smart-contracts/const-variables';
import { getStakeholderByEmail } from '../api/action/getStakeholder';
import { ethers } from 'ethers';
import StakeholderJson from "../../../hardhat/artifacts/contracts/Stakeholder.sol/Stakeholder.json"

const provder = new ethers.JsonRpcProvider(process.env.HARDHAT_RPC_URL)
const contract = new ethers.Contract(process.env.STAKEHOLDER_CONTRACT_ADDRESS ?? '', StakeholderJson.abi, provder)

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

        const onEthereum = await contract.getStakeholder(metaMaskAccount)

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
    const signer = await provder.getSigner(0);
    try {
        const tx = await contract.createStakeholder(
            validMetaMaskAccount,
            validEmail,
            getNow(),
            { from: signer.address }
        );

        const receipt = tx.wait();
    } catch (error) { }

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
