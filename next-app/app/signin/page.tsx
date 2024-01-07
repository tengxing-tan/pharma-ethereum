'use client'

import UserInput from "@/app/_ui/user-input"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { z } from "zod"

export default function SignIn({ searchParams }: {
    searchParams: {
        error: string
    }
}) {
    const [wallet, setWallet] = useState<{ accounts: string[] }>({
        accounts: [],
    });

    useEffect(() => {
        // connect metamask
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts: string[]) => {
                setWallet({ accounts });
            });
        }
    }, []);

    async function handleSignIn(formData: FormData) {

        const email = z.string().email().parse(formData.get("email"))
        const metaMaskAccount = z.string().regex(/0x[\w\d]+/g).parse(formData.get("metaMaskAccount"))
        // console.log(`Email: ${email}, MetaMask Account: ${metaMaskAccount}`)
        await signIn("stakeholder-login", { email: email, metaMaskAccount: metaMaskAccount, callbackUrl: "/product-catalogue" })
    }

    return (
        <form action={handleSignIn}>
            <div className="w-full min-h-screen p-6 flex flex-col justify-center items-center">
                <h1 className="pb-6 text-5xl font-medium text-gray-600">
                    Sign In </h1>
                <div className="bg-white w-full max-w-lg rounded-3xl border border-200 shadow py-20 px-12 lg:px-20 space-y-4">
                    {(searchParams.error === 'CredentialsSignin') ? (
                        <div className="bg-rose-100 border border-rose-500 rounded">
                            <p className="py-1 px-2 font-semibold text-rose-500">
                                🙀 Invalid credentials.</p>
                        </div>
                    ) : null}
                    {/* metamask account */}
                    <div className="w-full max-w-lg">
                        <label className="block pb-1 text-sm font-medium text-gray-700">
                            Metamask Account (Public key)
                            <span className="text-rose-500">*</span>
                            <div className="bg-white focus-within:ring-primary-500 mt-1 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset lg:max-w-md">
                                <p className="block flex-1 border-0 bg-transparent p-2 overflow-auto text-gray-900 placeholder:text-gray-400 focus:ring-0" >
                                    {
                                        // is connected
                                        (wallet.accounts.length > 0) ? (
                                            <span className="text-sm font-semibold text-green-500">
                                                Connected: <span className="text-gray-500 text-xs font-mono">{wallet.accounts[0]}</span></span>
                                        )
                                            // client does not install MetaMask
                                            : (
                                                <Link href="https://metamask.io/download/" target="_blank">
                                                    <button type="button" className="w-full bg-sky-500 text-white py-1 text-sm font-semibold hover:bg-sky-600 focus:bg-sky-700">
                                                        Download Metamask</button>
                                                </Link>
                                            )}
                                </p>
                            </div>
                        </label>
                        <input type="hidden" name="metaMaskAccount" required minLength={42} maxLength={42}
                            defaultValue={wallet.accounts.length > 0 ? String(wallet.accounts[0]) : ''} />
                    </div>
                    <UserInput
                        label="Email"
                        form={{
                            name: "email",
                            value: "",
                            type: "text",
                            placeholder: "",
                        }}
                        isRequired={true}
                    />
                    <div className="pt-6">
                        <button type="submit" className="bg-primary-500 focus:ring-primary-500 hover:bg-primary-600 w-full rounded-md py-2 text-sm font-semibold text-white shadow-sm focus:ring-2 focus:ring-offset-2">
                            Sign In</button>
                    </div>
                </div>
            </div>
        </form>
    )
}
