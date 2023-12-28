'use client'
import detectEthereumProvider from "@metamask/detect-provider";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Metamask() {
    const [hasProvider, setHasProvider] = useState<boolean | null>(null);
    const [wallet, setWallet] = useState({
        accounts: [],
    });

    useEffect(() => {
        // check if metamask is installed
        getProvider();
        // connect metamask
        if (typeof window.ethereum !== 'undefined') {
            connectMetaMask()
        }
    }, []);

    const getProvider = async () => {
        const provider = await detectEthereumProvider({ silent: true });
        setHasProvider(Boolean(provider));
    };

    const updateWallet = (accounts: any) => {
        setWallet({ accounts });
    };

    function connectMetaMask(): void {
        window.ethereum.request({
            method: 'eth_requestAccounts',
        }).then((accounts: any) => {
            updateWallet(accounts);
        });
    }

    return (
        <div className="w-full max-w-lg">
            <label className="block pb-1 text-sm font-medium text-gray-700">
                Metamask Account (Public key)
                <span className="text-rose-500">*</span>
                <div className="bg-white focus-within:ring-primary-500 mt-1 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset lg:max-w-md">
                    <p className="block flex-1 border-0 bg-transparent p-2 overflow-auto text-gray-900 placeholder:text-gray-400 focus:ring-0" >
                        {
                            // had installed MetaMask but have not connected yet
                            (hasProvider && wallet.accounts.length <= 0) ? (
                                <button type="button" className="w-full bg-sky-500 text-white py-1 rounded-md text-sm font-semibold hover:bg-sky-600 focus:bg-sky-700"
                                    onClick={connectMetaMask}>
                                    Connect MetaMask
                                </button>
                            )
                                // is connected
                                : (hasProvider && wallet.accounts.length > 0) ? (
                                    <span className="text-sm font-semibold text-green-500">
                                        Connected: <span className="text-gray-500 text-xs font-mono">{wallet.accounts[0]}</span></span>
                                )
                                    // client does not install MetaMask
                                    : (
                                        <Link href="https://metamask.io/download/" target="_blank">
                                            <button type="button" className="w-full bg-sky-500 text-white py-1 text-sm font-semibold hover:bg-sky-600 focus:bg-sky-700">
                                                Download Metamask</button>
                                        </Link>
                                    )}
                    </p>
                </div>
            </label>
            <input type="hidden" name="metaMaskAccount" required minLength={42} maxLength={42}
                defaultValue={wallet.accounts.length > 0 ? String(wallet.accounts[0]) : ''} />
        </div>
    )
}

// there is no type definition for ethereum in window object
// so we need to declare it
declare global {
    interface Window {
        ethereum: any;
    }
}
