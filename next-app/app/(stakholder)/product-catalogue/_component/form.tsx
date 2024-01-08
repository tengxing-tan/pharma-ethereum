'use client'

import UserInput from '@/app/_ui/user-input';
import { createNewProduct } from '../action';
import { Stakeholder } from '@prisma/client';
import { useSession } from 'next-auth/react';

export default function Form({
    manufacturers
}: {
    manufacturers: ManufacturerWithInfo[]
}) {

    const { data: session } = useSession()
    const email = session?.user?.email

    return (
        <form action={createNewProduct}>
            <input type="hidden" name="email" value={email ?? ''} />
            <div className="space-y-12 border-b border-gray-900/10 pb-12">
                {/* form section */}
                <div className="mt-8 grid w-full grid-cols-1 gap-6">
                    {/* user input */}
                    <UserInput
                        label="Registration No."
                        form={{
                            name: "registrationNo",
                            value: "",
                            type: "text",
                            min: 5,
                            placeholder: "Mininum 5 characters",
                        }}
                        isRequired={true}
                    />

                    {/* user input */}
                    <UserInput
                        label="Product Name"
                        form={{
                            name: "name",
                            value: "",
                            type: "text",
                        }}
                        isRequired={true}
                    />
                    {/* user input */}
                    <UserInput
                        label="Active Ingredient"
                        form={{
                            name: "activeIngredient",
                            value: "",
                            type: "text",
                        }}
                        isRequired={true}
                    />
                    {/* user input */}
                    <UserInput
                        label="Dosage Form"
                        form={{
                            name: "dosageForm",
                            value: "",
                            type: "text",
                        }}
                        isRequired={true}
                    />
                    {/* user input */}
                    <UserInput
                        label="Consumer Medicine Information (Attachment Link)"
                        form={{
                            name: "consumerMedicineInfo",
                            value: "",
                            type: "text",
                        }}
                        isRequired={false}
                    />
                    {/* user input */}
                    <div className="w-full max-w-sm">
                        <label className="block pb-1 text-sm font-medium text-gray-700">
                            Manufacturer
                            <span className="text-rose-500">*</span></label>
                        <div className="focus-within:ring-primary-500 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset lg:max-w-md">
                            <select name="manufacturerId" className="block flex-1 border-0 bg-transparent p-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 capitalize"
                                required>
                                <option key="0" value="0">Select Manufacturer</option>
                                {manufacturers.map((manufacturer: ManufacturerWithInfo) => (
                                    <option key={manufacturer.id} value={manufacturer.id} className="capitalize">
                                        {manufacturer.info.name.toLowerCase()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div >
            <div className="flex justify-start space-x-4 pt-6">
                <button type="submit" className="bg-primary-500 focus:ring-primary-500 hover:bg-primary-600 rounded-md px-6 py-3 text-sm font-semibold text-white shadow-sm focus:ring-1 focus:ring-inset">
                    Submit
                </button>
            </div>
        </form >
    )
}

type ManufacturerWithInfo = {
    id: string;
    stakeholderId: string;
    info: Stakeholder;
}
