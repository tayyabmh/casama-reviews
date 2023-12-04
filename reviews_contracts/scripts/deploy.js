const { ethers } = require("hardhat");

async function main() {
  const Reviews = await ethers.getContractFactory("Reviews");
  const reviews = await Reviews.deploy('0x4b48841d4b32C4650E4ABc117A03FE8B51f38F68');
  await reviews.deployed();

  console.log("Reviews deployed to:", reviews.address);

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
