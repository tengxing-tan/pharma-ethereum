import { ethers } from 'ethers';
import stakeholderAbi from "@/_utils/Stakeholder.json"

// Constants
export const RPC_URL = "http://127.0.0.1:8545"
export const STAKEHOLDER_CONTRACT_ADDRESS = "0xa85233c63b9ee964add6f2cffe00fd84eb32338f"

// Provider
export const provider = new ethers.JsonRpcProvider(RPC_URL);

// Get the account that will sign the transaction
export const signer = await provider.getSigner();

// Contract for getter
export const stakeholderContract = new ethers.Contract(STAKEHOLDER_CONTRACT_ADDRESS, stakeholderAbi.abi, provider);

// Contract for setter
// contract/[manage-].ts

// current timestamp for Ethereum (seconds)
export function getNow(): number {
    // now in ms (1704547985000)
    const currentTimestampInMs = Date.now();
    // Ethereum use seconds
    const currentTimestampInSeconds = Math.round(currentTimestampInMs / 1000);

    return currentTimestampInSeconds
}
