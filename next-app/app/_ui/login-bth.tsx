'use client'
import { useSession, signIn } from "next-auth/react"

export default function LoginButton() {
    const { data: session, status } = useSession()

    if (status === 'loading') return (
        <div className="absolute top-0 bottom-0 left-0 min-h-screen w-full flex justify-center items-center bg-gray-50">
            <p className="text-2xl text-gray-500">
                Signing you in...
            </p>
        </div>
    )

    return (
        <div className="p-2">
            <button onClick={() => signIn("email", { callbackUrl: "/product-catalogue" })} className="text-rose-400 font-semibold underline underline-offset-2 py-1 px-3">
                Supplier site</button>
        </div >
    )
}

