import { Drug, Stakeholder } from "@prisma/client";
import { Heading } from "app/_ui/heading";
import { getDrugBySearchKey } from "app/api/action/getDrug";
import Link from "next/link";

export default async function Page({ searchParams }: { searchParams: { type: string, searchKey: string } }) {
    const {
        type,
        searchKey
    } = searchParams;
    const result = await getDrugBySearchKey(type, searchKey);
    const TYPE = type === 'regNo' ? 'Registration no.' : type === 'productName' ? 'Product name' : 'Ingredient';

    return (
        <div className="max-w-5xl p-4 lg:px-6">
            <Heading heading="Supply Chain Overview" />
            <div className="pt-4 pb-8 text-gray-700">
                <p>Searching for "<span className="font-semibold">{searchKey}</span>" ({TYPE}).
                    There are {result !== null && result ? `${result.length} products found.` : 'Query error.'}
                </p>
            </div>
            <ul role="list" className="grid lg:grid-cols-2 gap-6 items-center">
                {result && result.map((item) => (
                    <li key={item.id} className="bg-white p-4 rounded-md shadow-md border border-gray-200 hover:bg-gray-100 hover:border-gray-300">
                        <Link href={`search/${item.id}`}>
                            <ProductItem props={{
                                drug: item,
                                manufacturer: item.manufacturer ? item.manufacturer.info : null,
                            }} />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function ProductItem({ props }: {
    props: {
        drug: Drug,
        manufacturer: Stakeholder | null,
    }
}) {
    return (
        <div className="text-gray-800">
            <p className="text-lg font-bold capitalize">{props.drug.name.toLowerCase()}</p>
            <p className="text-sm capitalize">Manufactured By: {props.manufacturer?.name.toLowerCase()}</p>
            <p className="text-sm capitalize">
                <span className="text-primary-500">
                    {props.drug.activeIngredient.toLowerCase()}</span> ({props.drug.dosageForm.toLowerCase()})
            </p>
        </div>
    )
}
