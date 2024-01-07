import { createStakeholder, storeOnEthereum } from './action';
import { Role } from '@prisma/client';
import Metamask from './_component/metamask';
import UserInput from '@/app/_ui/user-input';
import Link from 'next/link';

export default function Page(searchParams: {
    searchParams: {
        msg?: string,
    }
}) {

    // System message
    const popMessage = (msg: string) => {
        const message = (msg === 'success') ? '🥳 Successfully created your account!'
            : (msg === 'accHadTaken') ? '🧐 I found your account is on the database. Please login or try again with another email or MetaMask Account.'
                : null


        if (!message) return null

        return (
            <div className="absolute top-0 bottom-0 right-0 left-0 bg-gray-100">
                <div className="min-h-screen flex flex-col justify-center items-center gap-4">
                    <p className="text-xl text-gray-600 max-w-lg text-center">
                        {message}
                    </p>
                    {msg === 'success' ? (
                        <Link href="/product-catalogue">
                            <button type="button" className="bg-primary-500 focus:ring-primary-500 hover:bg-primary-600 rounded-md px-6 py-3 text-sm font-semibold text-white shadow-sm focus:ring-1 focus:ring-inset">
                                Login now</button></Link>
                    ) : msg === 'accHadTaken' ? (
                        <Link href="/register">
                            <button type="button" className="bg-primary-500 focus:ring-primary-500 hover:bg-primary-600 rounded-md px-6 py-3 text-sm font-semibold text-white shadow-sm focus:ring-1 focus:ring-inset">
                                Try again</button></Link>
                    ) : null
                    }
                </div>
            </div>
        )
    }

    if (searchParams.searchParams.msg)
        return popMessage(searchParams.searchParams.msg)

    return (
        <div className="max-w-none px-4">
            <form action={createStakeholder}>
                <div className="w-full min-h-screen">
                    <h1 className="pb-6 text-5xl font-medium text-gray-600">
                        Register</h1>
                    <div className="bg-white rounded-3xl border border-200 shadow pt-28 pb-20 px-20 space-y-4">

                        <p className="text-sm text-gray-70 bg-gray-100 p-2 rounded">
                            😎 Already had ad an account? <Link href="/product-catalogue" className="text-primary-500 underline">
                                Go to login</Link>
                        </p>

                        <Metamask contractAdd={process.env.STAKEHOLDER_CONTRACT_ADDRESS ?? ''} />

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
                            name: "phoneNo",
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
                            <div className="w-fite bg-white focus-within:ring-primary-500 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within n:ring-2 focus-within:ring-inset lg:max-w-lg">
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


// const readOnEthereum = async () => {

//     if (typeof contractAddress === 'undefined') return false

//     const contract = new ethers.Contract(contractAddress, abi.abi, provider);
//     // debugging
//     console.log("Contract: ", contract)
//     console.log("Abi: ", abi)

//     const getData = async () => {
//         const getResult = await contract.getStakeholder('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
//         console.log("My result: ", getResult.email)
//     }
//     getData()
//     return true
// }
