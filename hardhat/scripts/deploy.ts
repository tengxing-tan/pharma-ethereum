import { ethers } from "hardhat";

async function main() {

    // Deploy Contract
    console.log("deploying Stakeholder contract... will get admin address on constructor...")
    const now = new Date();
    const accounts = await ethers.getSigners();
    // hardhat configured accounts (20)
    // for (const account of accounts) {
    //     console.log(account.address);
    // }
    const adminAddr = accounts[0].address // the msg.sender
    const admin = await ethers.deployContract("Stakeholder", [Date.parse(now.toString())]);
    await admin.waitForDeployment();

    // Getter: admin address
    console.log("admin.target / contract address / deployed to: ", admin.target)
    const result = await admin.getStakeholder(adminAddr)
    console.log("finding my admin: ", formatted(result))

    // Setter: add Stakeholder
    console.log("adding Stakeholder...")
    const stakeholderAddr = '0x90f79bf6eb2c4f870365e785982e1f101e93b906'
    const stakeholder = await admin.addStakeholder(
        "tantengxing@email.com",
        stakeholderAddr,
        Date.parse(now.toString())
    );

    if (stakeholder) console.log("Stakeholder added successfully!")
    else console.log("Stakeholder not added!")

    // setter: verfiry Stakeholder
    console.log("\nverifying Stakeholder...")
    const verify = await admin.verifyStakeholder(stakeholderAddr, true)
    if (verify) console.log("Stakeholder verified successfully!")
    else console.log("Stakeholder not verified!")

    // review added stakeholder
    const result1 = await admin.getStakeholder(stakeholderAddr)
    console.log("Theeer Derrrr: ", formatted(result1))

    // emtpy stakeholder
    const result2 = await admin.getStakeholder(accounts[2].address)
    console.log("Theeer Derrrr: the empty stakeholder:\n", formatted(result2))



    const currentTimestampInSeconds = Math.round(Date.now() / 1000);


    const unlockTime = currentTimestampInSeconds + 60;

    const lockedAmount = ethers.parseEther("0.001");

    const lock = await ethers.deployContract("Lock", [unlockTime], {
        value: lockedAmount,
    });

    await lock.waitForDeployment();

    console.log(
        `Lock with ${ethers.formatEther(
            lockedAmount
        )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

// format getter output
const formatted = (stakeholderObj: any) => {
    return {
        email: stakeholderObj.email,
        metamaskAccount: stakeholderObj.metamaskAccount,
        registeredAt: new Date(Number(stakeholderObj.registeredAt)).toLocaleString(),
        verifiedAt: new Date(Number(stakeholderObj.verifiedAt) * 1000).toLocaleString(), // * 1000 because solidity returns seconds
        isAuthentic: stakeholderObj.isAuthentic
    }
}

/**
 * Sample project: Lock smart contract
 */

// async function main() {
//     const currentTimestampInSeconds = Math.round(Date.now() / 1000);
//     const unlockTime = currentTimestampInSeconds + 60;

//     const lockedAmount = ethers.parseEther("0.001");

//     const lock = await ethers.deployContract("Lock", [unlockTime], {
//         value: lockedAmount,
//     });

//     await lock.waitForDeployment();

//     console.log(
//         `Lock with ${ethers.formatEther(
//             lockedAmount
//         )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
//     );
// }
