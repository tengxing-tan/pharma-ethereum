'use server';

import { getDrugsByOwner } from 'app/api/action/getDrug';
import { Heading } from 'app/_ui/heading';
import { Badge } from 'app/_ui/badge';
import Link from 'next/link';
import { options } from 'app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Page({ searchParams }: {
    searchParams: {
        success: string
    }
}) {

    const session = await getServerSession(options)
    if (!session || !session.user?.email) {
        redirect(`/trace`)
    }
    const items = await getDrugsByOwner(session.user?.email)

    return (
        <div className="max-w-5xl">
            <Heading heading="Product Catalogue">
                <Link href="product-catalogue/create">
                    <button className="whitespace-nowrap bg-indigo-500 text-white font-semibold rounded-lg px-4 py-1 hover:bg-indigo-600 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Create</button>
                </Link>
            </Heading>

            {searchParams.success === "true" ? (
                <div>
                    <p className="px-4 py-2 max-w-lg text-gray-700 bg-green-100 border-l-2 border-green-500">
                        Product has been created successfully.</p>
                </div>
            ) : null}

            <p className="pt-4 text-sm text-gray-700">
                Showing {items.length} items.</p>

            <div className="mt-4 flex h-full flex-col bg-white py-2">
                <ul role="list" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {items &&
                        items.map((item) => (
                            <li key={item.id} className="flex flex-col justify-between p-4 rounded-md shadow-md bg-white border border-primary-300 hover:bg-gray-100 hover:border-primary-500">
                                <div className="flex flex-col overflow-clip pr-6">
                                    <p className="text-md font-semibold text-gray-800">
                                        {item.name}
                                    </p>
                                    <p className="py-1 text-xs text-primary-500 font-mono font-semibold">
                                        {item.registrationNo}
                                    </p>
                                </div>
                                <div>
                                    <p className="mt-1 text-xs text-gray-700">
                                        <span className="text-gray-500">Active ingredient: </span>{' '}
                                        <span> {item.activeIngredient}</span>
                                    </p>
                                    <p className="mt-1 text-xs text-gray-700">
                                        <span className="text-gray-500">Dosage form: </span>{' '}
                                        <span> {item.dosageForm}</span>
                                    </p>
                                    <p className="mt-1 text-xs text-gray-700">
                                        <span className="text-gray-500">Consumer Medicine Info: </span>{' '}
                                        <span> {item.consumerMedicineInfo ?? '-'}</span>
                                    </p>
                                </div>
                            </li>
                        ))}
                </ul>
            </div>
        </div >
    );
}
