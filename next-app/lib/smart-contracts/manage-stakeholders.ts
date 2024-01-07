import { stakeholderContract } from "./const-variables"

export async function validateMetaMaskAccount(metaMaskAccount: string) {

    try {
        // Convert the MetaMask account address to lowercase for consistency
        const normalizedAddress = metaMaskAccount.toLowerCase();

        // Call your contract to get the stakeholder details based on the MetaMask account
        const stakeholder = await stakeholderContract.getStakeholder(normalizedAddress)
        // console.log("🌭 Get from ethereum: ", stakeholder)

        return (stakeholder.email && stakeholder.email !== '')
            ? stakeholder.email
            : ''
    } catch (error) {
        console.error('Error validating MetaMask account:', error);
        return false;
    }
}
