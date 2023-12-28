import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
    title: 'Login',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="bg-gray-100">
            {children}
        </div>
    )
}
