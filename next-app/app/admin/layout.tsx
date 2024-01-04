import { Metadata } from "next"
import AdminNav from "./_components/admin-nav"

export const metadata: Metadata = {
    title: 'PharmaSCM | Admin',
    description: '',
}

export default function AdminLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <>
            <AdminNav />
            <div className="lg:pl-72">
                {children}
            </div>
        </>
    )
}