const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PunkDNA", function () {
  let punk_dna;
  beforeEach(async function() {
    const PunkDNA = await ethers.getContractFactory("XPunkDNA");
    punk_dna = await PunkDNA.deploy();
    await punk_dna.deployed();
  });

  it('should get DNA section', async() => {
    expect(await punk_dna.x_getDNASection(87654321, 0)).to.equal(21);
    expect(await punk_dna.x_getDNASection(87654321, 1)).to.equal(32);
    expect(await punk_dna.x_getDNASection(87654321, 2)).to.equal(43);
    expect(await punk_dna.x_getDNASection(87654321, 3)).to.equal(54);
    expect(await punk_dna.x_getDNASection(87654321, 4)).to.equal(65);
    expect(await punk_dna.x_getDNASection(87654321, 6)).to.equal(87);
    expect(await punk_dna.x_getDNASection(87654321, 8)).to.equal(0);
  })
});
