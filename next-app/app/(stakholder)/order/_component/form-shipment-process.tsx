import UserInput from 'app/_ui/user-input'
import FormProcessOption from './form-process'

export default function ShipmentProcess() {

    const getToday = () => new Date().toISOString().slice(0, 10)

    return (
        <>
            {/* form sub section: shipment process */}
            <h3 className="pt-6 text-gray-800 text-2xl font-semibold">
                Update Shipment Process</h3>

            {/* user input */}
            <FormProcessOption />

            <UserInput
                label="Short Description"
                form={{ name: "description", value: "", type: "text" }}
                isRequired={false} />
            <UserInput
                label="Date"
                form={{ name: "date", value: getToday(), type: "date" }}
                isRequired={true} />
            {/* user input */}
            <p className="text-sm text-gray-700 font-medium bg-gray-500/10 border-l-2 border-primary-500 p-2 max-w-sm">
                For shipment process, please provide buyer details.</p>
            <UserInput
                label="Company Name"
                form={{ name: "company", value: "", type: "text" }}
                isRequired={false} />
            <UserInput
                label="Country"
                form={{ name: "country", value: "", type: "text" }}
                isRequired={false} />
            <UserInput
                label="Address"
                form={{ name: "address", value: "", type: "text" }}
                isRequired={false} />
        </>
    )
}