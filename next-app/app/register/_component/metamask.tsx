'use client'

import { ethers } from "ethers";
import Link from "next/link";
import { useEffect, useState } from "react";
import stakeholderAbi from "@/_utils/Stakeholder.json";

export default function Metamask({ contractAdd }: {
    contractAdd: string
}) {

    const [wallet, setWallet] = useState<{ accounts: string[] }>({
        accounts: [],
    });
    const [email, setEmail] = useState('');

    useEffect(() => {
        // connect metamask
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts: string[]) => {
                setWallet({ accounts });
            });
        }
    }, []);

    const handleEmail = (e: any) => {
        setEmail(e.target.value)
    }

    async function handleContract() {
        if (typeof window.ethereum === 'undefined') return null

        const publicKey = wallet.accounts[0].toLocaleLowerCase()
        if (publicKey.length !== 42) return null

        let handleError = false

        // init contract
        const provider = new ethers.BrowserProvider(window.ethereum)
        // const provider = new ethers.JsonRpcProvider('http://localhost:8545')
        const signer = await provider.getSigner(0)
        const contract = new ethers.Contract(
            contractAdd,
            stakeholderAbi.abi,
            signer
        )
        console.log("contract: ", contract.target)
        if (contract.target === '') return null

        // call contract: addStakeholder
        try {
            const transaction = await contract.addStakeholder(
                email,
                publicKey,
                getNow(),
            )

            // get receipt (transaction hash)
            const receipt = await transaction.wait()
            console.log('get hash: ', receipt.hash)
        } catch (error) {
            console.log("Error: ", error)
            handleError = true
        }
        // if success, redirect to company page
    }

    return (
        <>
            <div className="w-full max-w-lg">
                <label className="block pb-1 text-sm font-medium text-gray-700">
                    Metamask Account (Public key)
                    <span className="text-rose-500">*</span>
                    <div className="bg-white focus-within:ring-primary-500 mt-1 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset lg:max-w-md">
                        <p className="block flex-1 border-0 bg-transparent p-2 overflow-auto text-gray-900 placeholder:text-gray-400 focus:ring-0" >
                            {
                                // is connected
                                (wallet.accounts.length > 0) ? (
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
            <div className="w-full max-w-sm">
                <label className="block text-sm font-medium text-gray-700">
                    Email
                    {true ? (<span className="text-rose-500">*</span>) : null}
                    <div className="bg-white focus-within:ring-primary-500 mt-1 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset lg:max-w-md">
                        <input className="block flex-1 border-0 bg-transparent p-2 text-gray-900  placeholder:text-gray-400 focus:ring-0"
                            name="email" type="email" value={email} onChange={handleEmail} required={true} />
                    </div>
                </label>
            </div>
            <div className="w-full flex justify-end pt-6">
                <button onClick={async () => handleContract()} type="button" className="bg-white text-primary-500 px-6 py-3 text-sm font-semibold border-2 border-primary-500 rounded-lg">
                    Next</button>
            </div>
        </>
    )
}

// there is no type definition for ethereum in window object
// so we need to declare it
declare global {
    interface Window {
        ethereum: any;
    }
}

// currentTimestampInSeconds
function getNow(): number {
    // now in ms (1704547985000)
    const currentTimestampInMs = Date.now();
    // Ethereum use seconds
    const currentTimestampInSeconds = Math.round(currentTimestampInMs / 1000);

    return currentTimestampInSeconds
}
