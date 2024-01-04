import { getDrugsByOwner } from "@/app/api/action/getDrug"

export default async function DrugList({ stakeholderId }: {
    stakeholderId: string
}) {

    const drugs = await getDrugsByOwner(stakeholderId)

    return (
        <>
            <p className="text-sm text-gray-700 pb-2">The company has {drugs.length} products.</p>
            <ul className="space-y-4">
                {drugs?.map((item) => (
                    <li key={item.id} className="text-gray-700 rounded shadow p-4">
                        <div className="bg-white">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-primary-500 font-semibold font-mono">{item.registrationNo}</p>
                            <p className="text-sm">{item.activeIngredient} ({item.dosageForm})</p>
                            <p className="text-sm">{item.consumerMedicineInfo}</p>
                            <div className="pt-2">
                                <p className="text-xs">Registered at: {item.createdAt.toDateString()}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}
