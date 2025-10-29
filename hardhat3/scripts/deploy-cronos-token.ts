// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from "hardhat";

const { ethers } = await hre.network.connect({});

async function main() {
  const CronosToken = await ethers.getContractFactory("CronosToken");
  const cronosToken = await CronosToken.deploy("Cronos Token", "CRT", "1000000000000000000000000");

  await cronosToken.waitForDeployment();

  console.log("CronosToken deployed to:", await cronosToken.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
