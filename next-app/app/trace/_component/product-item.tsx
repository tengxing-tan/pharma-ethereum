import { Drug, Stakeholder } from "@prisma/client"

export default function ProductItem({ props }: {
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