const { ethers } = require("hardhat");

async function main() {
    console.log('Getting the CHL token contract...');
    const contractAddress = 'contractAddress'; // enter your deployed contract address here
    const chlToken = await ethers.getContractAt('CHLToken', contractAddress);

    // name()
    console.log('Querying token name...');
    const name = await chlToken.name();
    console.log(`Token Name: ${name}\n`);

    // symbol()
    console.log('Querying token symbol...');
    const symbol = await chlToken.symbol();
    console.log(`Token Symbol: ${symbol}\n`);

    // decimals()
    console.log('Querying decimals...');
    const decimals = await chlToken.decimals();
    console.log(`Token Decimals: ${decimals}\n`);
}

// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });