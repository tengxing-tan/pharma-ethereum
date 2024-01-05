import { ethers } from 'ethers';
import stakeholderAbi from "@/_utils/Stakeholder.json"
import { STAKEHOLDER_CONTRACT_ADDRESS, RPC_URL } from "./constants"

// Assume you have an ethers.js provider and contract instance
const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(STAKEHOLDER_CONTRACT_ADDRESS, stakeholderAbi.abi, provider);

export async function validateMetaMaskAccount(metaMaskAccount: string) {

    try {
        // Convert the MetaMask account address to lowercase for consistency
        const normalizedAddress = metaMaskAccount.toLowerCase();

        // Call your contract to get the stakeholder details based on the MetaMask account
        const stakeholder = await contract.getStakeholder(normalizedAddress)
        // console.log("🌭 Get from ethereum: ", stakeholder)

        return (stakeholder.email && stakeholder.email !== '')
            ? stakeholder.email
            : ''
    } catch (error) {
        console.error('Error validating MetaMask account:', error);
        return false;
    }
}
