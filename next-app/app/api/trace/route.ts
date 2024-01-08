import { getDrugBatch, getStakeholders } from "./action"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const batchNo = searchParams.get('batchNo')
    const stakeholderId = searchParams.get('stakeholderId')

    const result = (batchNo) ? await getDrugBatch(batchNo)
        : (stakeholderId) ? await getStakeholders(stakeholderId)
            : {}

    return new Response(JSON.stringify(result))
}
