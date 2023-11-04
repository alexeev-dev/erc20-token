const { expect } = require("chai");
const { ethers } = require("hardhat");

const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("CHLToken", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.

    async function deployTokenFixture() {
        // Get the Signers here.
        const [owner, addr1, addr2] = await ethers.getSigners();
    
        // To deploy our contract, we just have to call ethers.deployContract and await
        // its waitForDeployment() method, which happens once its transaction has been
        // mined.
        const hardhatToken = await ethers.deployContract("CHLToken");
    
        await hardhatToken.waitForDeployment();
    
        // Fixtures can return anything you consider useful for your tests
        return { hardhatToken, owner, addr1, addr2 };
    }

    describe("Deployment", function () {

        it("Should set the right owner", async function () {
          const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
          expect(await hardhatToken.owner()).to.equal(owner.address);
        });
    
        it("Should assign the total supply of tokens to the owner", async function () {
          const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
          const ownerBalance = await hardhatToken.balanceOf(owner.address);
          expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
        });
    });
    
    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
          const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
            deployTokenFixture
          );
          // Transfer 50 tokens from owner to addr1
          await expect(
            hardhatToken.transfer(addr1.address, 50)
          ).to.changeTokenBalances(hardhatToken, [owner, addr1], [-50, 50]);
    
          // Transfer 50 tokens from addr1 to addr2
          // We use .connect(signer) to send a transaction from another account
          await expect(
            hardhatToken.connect(addr1).transfer(addr2.address, 50)
          ).to.changeTokenBalances(hardhatToken, [addr1, addr2], [-50, 50]);
        });
    
        it("Should emit Transfer events", async function () {
          const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
            deployTokenFixture
          );
    
          // Transfer 50 tokens from owner to addr1
          await expect(hardhatToken.transfer(addr1.address, 50))
            .to.emit(hardhatToken, "Transfer")
            .withArgs(owner.address, addr1.address, 50);
    
          // Transfer 50 tokens from addr1 to addr2
          // We use .connect(signer) to send a transaction from another account
          await expect(hardhatToken.connect(addr1).transfer(addr2.address, 50))
            .to.emit(hardhatToken, "Transfer")
            .withArgs(addr1.address, addr2.address, 50);
        });
    });

});