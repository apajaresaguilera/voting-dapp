const hre = require("hardhat");

async function main() {
  const votingContract = await ethers.getContractFactory("Voting");
  const votingCntrct = await votingContract.deploy();

  await votingCntrct.deployed();

  console.log("contract deployed to:", votingCntrct.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
