import { ethers } from "hardhat";

async function main() {
    const FUSD = await ethers.getContractFactory("FAKE_USD");
    const fusd = await FUSD.deploy();
    await fusd.deployed();

    console.log(`FUSD deployed to ${fusd.address}`);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}
);