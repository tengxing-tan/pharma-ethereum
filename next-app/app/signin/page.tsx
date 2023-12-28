'use client'

import UserInput from "@/app/_ui/user-input"
import Metamask from "@/app/register/_component/metamask"
import { signIn } from "next-auth/react"

export default function SignIn() {

    const handleSignIn = () => {
        signIn("email", { email: "jsmith", callbackUrl: "/product-catalogue" })
    }

    return (
        <form action={handleSignIn}>
            <div className="w-full min-h-screen p-6 flex flex-col justify-center items-center">
                <h1 className="pb-6 text-5xl font-medium text-gray-600">
                    Sign In </h1>
                <div className="bg-white w-full max-w-lg rounded-3xl border border-200 shadow py-20 px-12 lg:px-20 space-y-4">

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
