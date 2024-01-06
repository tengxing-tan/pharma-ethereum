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

    // get stakeholder
    const viewAcc9 = await contract.getStakeholder(acc9)

    // verfiry stakeholder
    await contract.verifyStakeholder(acc9, true, { value: ethers.parseEther("0") })
    // etherjs use this, hardhat use above
    // const verfiedAcc9 = await contract.verifyStakeholder(acc9, true, { value: ethers.utils.parseEther("0") })
    const viewAcc9AfterVerified = await contract.getStakeholder(acc9)

    // print
    console.log("😼 Gottiu contract target", contract.target)
    console.log(`😼 Gottiu stakeholder account #9
        Transaction hash: ${stakeholder.hash}
        From: ${stakeholder.from}
        To: ${stakeholder.to}
        Gas Price: ${stakeholder.gasPrice.toString()}`
    )
    console.log("😼 Gottiu stakeholder account #9\n", formattedStakeholderObj(viewAcc9))
    console.log("😼 Gottiu stakeholder account #9\n", formattedStakeholderObj(viewAcc9AfterVerified))
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
