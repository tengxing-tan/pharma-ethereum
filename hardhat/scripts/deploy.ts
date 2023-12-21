import { network, ethers } from "hardhat";

async function main() {
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

  console.log("\n\n\n\n")
  console.log('Next, Its my showtime:\n\n')

  const admin = await ethers.deployContract("Stakeholder");
  await admin.waitForDeployment();

  console.log("admin.target / contract address / deployed to: ", admin.target)
  const result = await admin.getStakeholder('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
  console.log("finding my admin: ", result)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
