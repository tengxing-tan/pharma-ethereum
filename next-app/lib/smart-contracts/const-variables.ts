import { ethers } from 'ethers';
import stakeholderAbi from "@/_utils/Stakeholder.json"

// Constants
const RPC_URL = "http://127.0.0.1:8545"
export const STAKEHOLDER_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

// Provider
export const provider = new ethers.JsonRpcProvider(RPC_URL);

// Get the account that will sign the transaction
export const signer = await provider.getSigner();

// Contract for getter
export const stakeholderContract = new ethers.Contract(STAKEHOLDER_CONTRACT_ADDRESS, stakeholderAbi.abi, provider);

// Contract for setter
// export const stakeholderContractWithSigned = new ethers.Contract(STAKEHOLDER_CONTRACT_ADDRESS, stakeholderAbi.abi, signer);
export async function getSignedShContract(provider?: ethers.BrowserProvider) {
    const signer = (provider)
        ? await provider?.getSigner()
        : new ethers.JsonRpcProvider(RPC_URL);
    return new ethers.Contract(STAKEHOLDER_CONTRACT_ADDRESS, stakeholderAbi.abi, signer);
}

// current timestamp for Ethereum (seconds)
export function getNow(): number {
    // now in ms (1704547985000)
    const currentTimestampInMs = Date.now();
    // Ethereum use seconds
    const currentTimestampInSeconds = Math.round(currentTimestampInMs / 1000);

    return currentTimestampInSeconds
}
