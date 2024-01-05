'use client'

import UserInput from "@/app/_ui/user-input"
import Metamask from "@/app/register/_component/metamask"
import { signIn } from "next-auth/react"
import { z } from "zod"

export default function SignIn({ searchParams }: {
    searchParams: {
        error: string
    }
}) {
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

                    <Metamask />
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
