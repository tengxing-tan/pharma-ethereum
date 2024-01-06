import { DrugBatch, Stakeholder } from "@prisma/client"
import Manufacturing from "./manufacturing"
import ScProcess from "./sc-process"

export default function ScOverview({ props }: {
    props: {
        drugBatch: DrugBatch | null | undefined,
        manufacturer: Stakeholder | null | undefined,
        importer: Stakeholder | null | undefined,
        wholesaler: Stakeholder | null | undefined,
    }
}) {

    if (!props.drugBatch || typeof props.drugBatch === "undefined"
        || !props.manufacturer || typeof props.manufacturer === "undefined") {
        return <div>loading...</div>
    }

    return (
        <div className="flex flex-col items-center justify-center bg-gray-500/5 p-6">
            {/* Phase 1: Manufacturing and Packaging */}
            <h3 className="mb-6 w-full text-center text-xl text-gray-600">
                Manufacturing and Packaging</h3>
            <Manufacturing
                drugBatchId={props.drugBatch?.id}
                manDate={props.drugBatch?.manufactureDate}
                manufacturer={props.manufacturer} />

            {/* Phase 2: Import (optional) */}
            <h3 className="mt-12 mb-6 w-full text-center text-xl text-gray-600">
                Import</h3>
            <ScProcess props={{
                drugBatchId: props.drugBatch?.id,
                stakeholder: props.importer,
                color: String("amber")
            }} />

            {/* Phase 3: Distribution & Warehousing (stakeholder: wholesaler) */}
            <h3 className="mt-12 mb-6 w-full text-center text-xl text-gray-600">
                Distribution & Warehousing</h3>
            <ScProcess props={{
                drugBatchId: props.drugBatch?.id,
                stakeholder: props.wholesaler,
                color: String("emerald")
            }} />
        </div>
    )
}