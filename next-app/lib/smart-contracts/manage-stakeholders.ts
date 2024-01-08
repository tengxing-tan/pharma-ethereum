'use server'

import { ethers } from "ethers";
import StakeholderJson from "../../../hardhat/artifacts/contracts/Stakeholder.sol/Stakeholder.json"

const provider = new ethers.JsonRpcProvider(process.env.HARDHAT_RPC_URL)
const contract = new ethers.Contract(process.env.STAKEHOLDER_CONTRACT_ADDRESS ?? '', StakeholderJson.abi, provider);

export async function validateMetaMaskAccount(metaMaskAccount: string) {
    if (!contract || contract === undefined) return null

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

export async function getStakeholderOnEth(metaMaskAccount: string) {
    if (!contract || contract === undefined) return null

    try {
        // Convert the MetaMask account address to lowercase for consistency
        const normalizedAddress = metaMaskAccount.toLowerCase();

        // Call your contract to get the stakeholder details based on the MetaMask account
        const stakeholder = await contract.getStakeholder(normalizedAddress)
        // console.log("🌭 Get from ethereum: ", stakeholder)

        return stakeholder
    } catch (error) {
        console.error('Error validating MetaMask account:', error);
        return null;
    }
}
