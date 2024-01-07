import { ethers } from "hardhat";

async function verifyStakeholder() {

    // Initialize Stakeholder contract
    const contract = await iniStakeholderContract()

    // add one stakeholder
    const acc9 = '0xa0Ee7A142d267C1f36714E4a8F75612F20a79720'
    const stakeholder = await contract.addStakeholder(
        "nine@mail.com",
        acc9,
        getNow(),
    )
    const tengxing = await contract.addStakeholder(
        'tantengxing@email.com',
        '0x90f79bf6eb2c4f870365e785982e1f101e93b906',
        getNow(),
    )

    // get stakeholder
    const viewAcc9 = await contract.getStakeholder(acc9)

    // verify stakeholder
    await contract.verifyStakeholder(acc9, true, { value: ethers.parseEther("0") })
    const viewAcc9AfterVerified = await contract.getStakeholder(acc9)

    // get empty stakeholder
    const emptyObj = await contract.getStakeholder('0x90f79bf6eb2c4f870365e785982e1f101e93b909')

    // print
    console.log("😼 Gottiu contract target", contract.target.toString().toLowerCase())
    console.log(`
        😼 Gottiu stakeholder account #9
        Transaction hash: ${stakeholder.hash}
        From: ${stakeholder.from}
        To: ${stakeholder.to}
        Gas Price: ${stakeholder.gasPrice.toString()}\n`
    )
    console.log("\n😼 Gottiu stakeholder account #9\n", formattedStakeholderObj(viewAcc9))
    console.log("\n😼 Gottiu stakeholder account #9\n", formattedStakeholderObj(viewAcc9AfterVerified))
    console.log("\n😼 Gottiu empty stakeholder\n", formattedStakeholderObj(emptyObj))
}

try {
    verifyStakeholder();
} catch (error) {
    console.error(error);

    //  Developers often use different non-zero exit codes 
    //  to signal different types of errors or issues
    process.exitCode = 1;
}

async function iniStakeholderContract() {

    // Deploy stakeholder contract
    const contract = await ethers.deployContract(
        "Stakeholder", // Contract name
        // Constructor arguments (it is array 👻)
        [
            getNow(),
        ])

    return contract
}

function getNow() {
    // now in ms (1704547985000)
    const currentTimestampInMs = Date.now();
    // Ethereum use seconds
    const currentTimestampInSeconds = Math.round(currentTimestampInMs / 1000);

    return currentTimestampInSeconds
}

// format getter output
function formattedStakeholderObj(stakeholderObj: any) {
    return {
        email: stakeholderObj.email,
        metamaskAccount: stakeholderObj.metamaskAccount,
        registeredAt: stakeholderObj.registeredAt ? new Date(Number(stakeholderObj.registeredAt) * 1000).toString() : null,
        verifiedAt: stakeholderObj.verifiedAt ? new Date(Number(stakeholderObj.verifiedAt) * 1000).toString() : null,
        isAuthentic: stakeholderObj.isAuthentic
    }
}
