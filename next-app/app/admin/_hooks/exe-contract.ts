'use client'

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { STAKEHOLDER_CONTRACT_ADDRESS, getSignedShContract } from '@/lib/smart-contracts/const-variables';
import stakeholderAbi from "@/_utils/Stakeholder.json"

const useEthereum = () => {
    const [ethersProvider, setEthersProvider] = useState<ethers.BrowserProvider | null>(null);

    useEffect(() => {
        // Initialize Ethereum provider (MetaMask injected provider)
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.BrowserProvider(window.ethereum);
            setEthersProvider(provider);
        }
    }, []);

    const connectWallet = async () => {
        try {
            // Request user to connect their wallet
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            // Optional: You can get the connected account using provider.getSigner()
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    };

    const verifyStakeholder = async (metaMaskAcc?: string, isVerified?: boolean) => {
        if (!ethersProvider) {
            console.error('Ethereum provider not available');
            return;
        }

        // handle contract
        try {
            // const contract = await getSignedShContract(ethersProvider)
        } catch (error) {
            console.error('Error getting contract:', error);
        }
        // contract.verifyStakeholder(metaMaskAcc, isVerified, { value: ethers.parseEther("0.001") })
    };

    return {
        connectWallet,
        verifyStakeholder,
    };
};

export default useEthereum;