import { expect } from "chai";

import hre from "hardhat";
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const { ethers } = await hre.network.connect();

const initialSupply = ethers.parseEther("1000000");

const CronosTokenModule = buildModule("Counter", (m) => {
    const cronosTokenInst = m.contract("CronosToken", ["Cronos Token", "CT", initialSupply]);

    return { cronosTokenInst };
});

async function deployCronosTokenModuleFixture() {
    const { ignition } = await hre.network.connect();
    return ignition.deploy(CronosTokenModule);
}

async function resetState() {
    const { networkHelpers } = await hre.network.connect();
    const { cronosTokenInst } = await networkHelpers.loadFixture(
        deployCronosTokenModuleFixture
    );
    return cronosTokenInst;
}

describe("CronosToken2", function () {
    let owner: any, alice: any, bob: any;

    beforeEach(async function () {
        [owner, alice, bob] = await ethers.getSigners();
    });

    it("should have correct name and symbol", async function () {
        const cronosTokenInst = await resetState();

        expect(await cronosTokenInst.name()).to.equal("Cronos Token");
        expect(await cronosTokenInst.symbol()).to.equal("CT");
    });

    it("should assign initial supply to owner", async function () {
        const cronosTokenInst = await resetState();

        const balance = await cronosTokenInst.balanceOf(owner.address);
        expect(balance).to.equal(initialSupply);
    });

    it("should transfer tokens between accounts", async function () {
        const cronosTokenInst = await resetState();

        const amount = ethers.parseEther("100");

        await cronosTokenInst.transfer(alice.address, amount);
        expect(await cronosTokenInst.balanceOf(alice.address)).to.equal(amount);
    });
});