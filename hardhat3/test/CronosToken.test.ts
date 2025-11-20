import { expect } from "chai";

import hre from "hardhat";
import { CronosToken } from "../types/ethers-contracts/CronosToken.js";

const { ethers } = await hre.network.connect();

describe("CronosToken", function () {
    let cronosTokenInst: CronosToken;
    let owner: any, alice: any, bob: any;
    const initialSupply = ethers.parseEther("1000000");

    beforeEach(async function () {
        [owner, alice, bob] = await ethers.getSigners();

        const TokenFactory = await ethers.getContractFactory("CronosToken");
        cronosTokenInst = (await TokenFactory.deploy("Cronos Token", "CT", initialSupply)) as CronosToken;
        await cronosTokenInst.waitForDeployment();
    });

    it("should have correct name and symbol", async function () {
        expect(await cronosTokenInst.name()).to.equal("Cronos Token");
        expect(await cronosTokenInst.symbol()).to.equal("CT");
    });

    it("should assign initial supply to owner", async function () {
        const balance = await cronosTokenInst.balanceOf(owner.address);
        expect(balance).to.equal(initialSupply);
    });

    it("should transfer tokens between accounts", async function () {
        const amount = ethers.parseEther("100");

        await cronosTokenInst.transfer(alice.address, amount);
        expect(await cronosTokenInst.balanceOf(alice.address)).to.equal(amount);

        await cronosTokenInst.connect(alice).transfer(bob.address, amount / 2n);
        expect(await cronosTokenInst.balanceOf(bob.address)).to.equal(amount / 2n);
    });

    it("should approve and transferFrom correctly", async function () {
        const amount = ethers.parseEther("50");

        await cronosTokenInst.approve(alice.address, amount);
        expect(await cronosTokenInst.allowance(owner.address, alice.address)).to.equal(amount);

        await cronosTokenInst.connect(alice).transferFrom(owner.address, bob.address, amount);
        expect(await cronosTokenInst.balanceOf(bob.address)).to.equal(amount);
    });

    it("should revert if transfer exceeds balance", async function () {
        const fromBalance = await cronosTokenInst.balanceOf(alice.address);
        const transferAmount = 100;

        await expect(
            cronosTokenInst.connect(alice).transfer(owner.address, transferAmount)
        ).to.be.revertedWithCustomError(cronosTokenInst, "ERC20InsufficientBalance")
            .withArgs(alice.address, fromBalance, transferAmount);
    });
});