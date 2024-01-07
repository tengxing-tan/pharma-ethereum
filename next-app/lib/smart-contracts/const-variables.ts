import { ethers } from 'ethers';
import StakeholderJson from "../../../hardhat/artifacts/contracts/Stakeholder.sol/Stakeholder.json"

// Constants
export const RPC_URL = "http://127.0.0.1:8545"

// Provider
export const provider = new ethers.JsonRpcProvider(RPC_URL);

// Get the account that will sign the transaction
export const signer = await provider.getSigner();

// Contract for getter
export const stakeholderContract = new ethers.Contract(process.env.STAKEHOLDER_CONTRACT_ADDRESS ?? '', StakeholderJson.abi, provider);

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
