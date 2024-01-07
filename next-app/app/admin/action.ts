'use server'

import { STAKEHOLDER_CONTRACT_ADDRESS } from "@/lib/smart-contracts/const-variables";
import stakeholderAbi from "@/_utils/Stakeholder.json";
import { ethers } from "ethers";

export async function verifyStakeholder(
    // metaMaskExt: ethers.Eip1193Provider,
    provider: ethers.BrowserProvider,
    metaMaskAccount: string,
    isVerified: boolean
) {
    // Convert the MetaMask account address to lowercase for consistency
    const normalizedAddress = metaMaskAccount.toLowerCase();

    // get contract with signed
    const signer = await provider?.getSigner()
    const contract = new ethers.Contract(
        STAKEHOLDER_CONTRACT_ADDRESS,
        stakeholderAbi.abi,
        signer
    )

    // handle contract
    const receipt = await contract.verifyStakeholder(normalizedAddress, isVerified, { value: ethers.parseEther("0.001") })

    // output
    console.log(`
        😎 Verify stakeholder: ${normalizedAddress}
        Transaction hash: ${receipt.hash}`)
}
