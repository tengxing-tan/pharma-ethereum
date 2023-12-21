'use client' // for error page
import Link from "next/link"

export default function Page() {
    return (
        <div className="bg-gray-400/10 absolute top-0 left-0 right-0">
            <div className="w-screen min-h-screen flex justify-center items-center">
                <div className="flex flex-col items-center">
                    <h1 className="mt-12 text-2xl text-gray-600">
                        Error | Item Not Found. </h1>
                    <Link href="/trace" className="pt-4 text-primary-500 font-semibold">
                        Trace again</Link>
                </div>
            </div>
        </div>
    )
}