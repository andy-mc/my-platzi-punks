const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PlatziPunks", function () {
  it("Should init contract with name and symbol", async function () {
    const PlatziPunks = await ethers.getContractFactory("PlatziPunks");
    const platzi_punks = await PlatziPunks.deploy();
    await platzi_punks.deployed();

    expect(await platzi_punks.name()).to.equal("PlatziPunks");
    expect(await platzi_punks.symbol()).to.equal("PLPKS");
  });
});
