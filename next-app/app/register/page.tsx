'use client'
import { createStakeholder } from './action';
import { Role } from '@prisma/client';
import Metamask from './_component/metamask';
import UserInput from '@/app/_ui/user-input';
import Link from 'next/link';
import { ethers } from 'ethers';
import abi from "@/_utils/Stakeholder.json"

const RPC_URL = "http://127.0.0.1:8545"
const STAKEHOLDER_CONTRACT_ADDRESS = "0x4c5859f0F772848b2D91F1D83E2Fe57935348029"

const provider = new ethers.JsonRpcProvider(RPC_URL);
const contractAddress = STAKEHOLDER_CONTRACT_ADDRESS;

export default function Page() {
    const result = storeOnEthereum("my@mail.com", "0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    console.log("Result: ", result)

    return (
        <div className="max-w-none px-4">
            <form action={createStakeholder}>
                <div className="min-h-screen">
                    <h1 className="pb-6 text-5xl font-medium text-gray-600">
                        Register</h1>
                    <div className="bg-white rounded-3xl border border-200 shadow pt-28 pb-20 px-20 space-y-4">
                        <Metamask />

                        <UserInput label="Email" isRequired={true}
                            form={{
                                name: "email",
                                type: "email",
                                value: "",
                            }}
                        />
                        <div className="w-full flex justify-end pt-6">
                            <button type="button" className="bg-white text-primary-500 px-6 py-3 text-sm font-semibold border-2 border-primary-500 rounded-lg">
                                <Link href="#company">
                                    Next</Link></button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 border-b border-gray-900/10 pb-12">
                    {/* form section company information */}
                    <h3 id="company" className="mt-12 border-t border-t-gray-300 pt-3 text-2xl font-semibold text-gray-700">
                        Company Information</h3>
                    <UserInput label="Company Name" isRequired={true}
                        form={{
                            name: "name",
                            type: "text",
                            value: "",
                        }}
                    />
                    <UserInput label="Phone No." isRequired={true}
                        form={{
                            name: "phone",
                            type: "text",
                            value: "",
                        }}
                    />
                    <UserInput label="Company Address" isRequired={false}
                        form={{
                            name: "address",
                            type: "text",
                            value: "",
                        }}
                    />
                    <UserInput label="Postcode" isRequired={false}
                        form={{
                            name: "postcode",
                            type: "text",
                            value: "",
                        }}
                    />
                    <UserInput label="State" isRequired={false}
                        form={{
                            name: "state",
                            type: "text",
                            value: "",
                        }}
                    />
                    <UserInput label="Country" isRequired={true}
                        form={{
                            name: "country",
                            type: "text",
                            value: "",
                        }}
                    />

                    <div className="w-full sm:w-72">
                        <label className="block pb-1 text-sm font-medium text-gray-700">
                            Role
                            <span className="text-rose-500">*</span>
                            <div className="w-fite bg-white focus-within:ring-primary-500 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within n:ring-2 focus-within:ring-inset lg:max-w-md">
                                <select name="role" className="w-full block flex-1 border-0 bg-transparent p-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 capitalize">
                                    {Object.values(Role).map((role) => (
                                        <option key={role} value={role} className="capitalize">{role.toLowerCase()}</option>
                                    ))}
                                </select>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="flex justify-start space-x-4 pt-6">
                    <button type="submit" className="bg-primary-500 focus:ring-primary-500 hover:bg-primary-600 rounded-md px-6 py-3 text-sm font-semibold text-white shadow-sm focus:ring-1 focus:ring-inset">
                        Submit</button>
                </div>
            </form >
        </div >
    );
}

const storeOnEthereum = async (
    email: string,
    metaMaskAccount: string
) => {
    if (typeof contractAddress === 'undefined') {
        console.log("Contract address is undefined")
        return false
    }

    const signer = await provider.getSigner(); // Get the account that will sign the transaction
    const contract = new ethers.Contract(contractAddress, abi.abi, signer);
    const timestamp = Date.now()

    try {
        const transaction = await contract.addStakeholder(
            "teng@email.com",
            "0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f",
            Number(Date.parse(timestamp.toString())));
        // await transaction.wait(); // Wait for the transaction to be mined
        console.log("🚀 Store on Ethereum! Transaction hash: ", transaction.hash);
    } catch (error) {
        console.log("I felt not good, Error: ", error)
    }
    return true
}


const readOnEthereum = async () => {

    if (typeof contractAddress === 'undefined') return false

    const contract = new ethers.Contract(contractAddress, abi.abi, provider);
    // debugging
    console.log("Contract: ", contract)
    console.log("Abi: ", abi)

    const getData = async () => {
        const getResult = await contract.getStakeholder('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
        console.log("My result: ", getResult.email)
    }
    getData()
    return true
}
