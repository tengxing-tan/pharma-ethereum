'use server';

import { Heading } from 'app/_ui/heading';
import { options } from 'app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import LogoutButton from '@/app/_ui/logout-btn';
import { updateStakeholder } from './action';
import UserInput from '@/app/_ui/user-input';
import { getStakeholderByEmail } from '@/app/api/action/getStakeholder';
import Link from 'next/link';
import clsx from 'clsx';

export default async function Page({ searchParams }: {
    searchParams: {
        msg?: string
    }
}) {

    const session = await getServerSession(options)
    if (!session || !session.user?.email) {
        redirect(`/trace`)
    }

    // Get metamask account from session
    const metaMaskAccount = "🙀 Your have no MetaMask Account"

    // Retrieve stakeholder details from database
    const userProfile = await getStakeholderByEmail(session.user.email)
    if (!userProfile) return null

    return (
        <div className="max-w-5xl p-6 md:p-0">
            <Heading heading="My Profile">
                <LogoutButton />
            </Heading>
            {searchParams.msg ? <ErrorMessage msg={searchParams.msg} /> : null}

            <form action={updateStakeholder}>
                <input type="hidden" name="id" value={userProfile.id} />
                <div className="mt-6 space-y-6">
                    <h3 id="account" className="pt-3 text-2xl font-semibold text-gray-700">
                        <span className="text-primary-400 font-bold"># </span>
                        <Link href="#account">My Account</Link></h3>
                    <NonEditableData label="MetaMask Account" value={metaMaskAccount} />
                    <NonEditableData label="Email" value={userProfile.email} />
                    <NonEditableData label="Role" value={userProfile.role.toLowerCase()} />
                </div>

                <div className="space-y-6 border-b border-gray-900/10 pb-12">
                    {/* form section company information */}
                    <h3 id="company" className="mt-12 border-t border-t-gray-300 pt-3 text-2xl font-semibold text-gray-700">
                        <span className="text-primary-500 font-bold"># </span>
                        <Link href="#company">Company Information</Link></h3>
                    <UserInput label="Company Name" isRequired={true}
                        form={{
                            name: "name",
                            type: "text",
                            value: userProfile.name,
                        }}
                    />
                    <UserInput label="Phone No." isRequired={true}
                        form={{
                            name: "phoneNo",
                            type: "tel",
                            pattern: "01[0-9]-[0-9]{7,8}",
                            placeholder: "01x-xxxx",
                            value: userProfile.phoneNo,
                        }}
                    />
                    <UserInput label="Company Address" isRequired={false}
                        form={{
                            name: "address",
                            type: "text",
                            value: userProfile.address,
                        }}
                    />
                    <UserInput label="Postcode" isRequired={false}
                        form={{
                            name: "postcode",
                            type: "text",
                            value: userProfile.postcode,
                        }}
                    />
                    <UserInput label="State" isRequired={false}
                        form={{
                            name: "state",
                            type: "text",
                            value: userProfile.state,
                        }}
                    />
                    <UserInput label="Country" isRequired={true}
                        form={{
                            name: "country",
                            type: "text",
                            value: userProfile.country,
                        }}
                    />

                </div>

                <div className="flex justify-start space-x-4 pt-6">
                    <button type="submit" className="bg-primary-500 focus:ring-primary-500 hover:bg-primary-600 rounded-md px-6 py-3 text-sm font-semibold text-white shadow-sm focus:ring-1 focus:ring-inset">
                        Update Profile</button>
                </div>
            </form >
        </div >
    );
}

const NonEditableData = ({ label, value }: { label: string, value: any }) => (
    <label className="block w-full max-w-sm text-sm font-medium text-gray-700">
        {label}
        <p className="mt-1 border border-gray-300 rounded-md shadow-sm bg-white p-2 text-gray-600">
            {value}
        </p>
    </label>
)

const ErrorMessage = ({ msg }: { msg?: string | null }) => {

    const text = (msg === 'success') ? `👍 Update profile successfully!`
        : 'Something wrong 🤫'

    return (
        <div className={clsx(
            "bg-gray-500/10 font-serif font-semibold p-2 mb-4 rounded-md",
            {
                "text-green-500": msg === 'success',
                "text-rose-500": msg !== 'success',
            }
        )}>
            {text}
        </div >
    )
}
