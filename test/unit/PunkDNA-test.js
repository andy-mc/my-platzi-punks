const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PunkDNA", function () {
  let punk_dna;
  beforeEach(async function() {
    const PunkDNA = await ethers.getContractFactory("XPunkDNA");
    punk_dna = await PunkDNA.deploy();
    await punk_dna.deployed();
  });

  it('should throw an error if requested section is 0 or negative', async() => {
    try {
      await punk_dna.x_getDNASection(87654321, 0)
      expect.fail('error');
    } catch (error) {
      expect(error.message).to.contains("Section cannot be 0 or a negative number. That section doesn't exists");
    }
  })

  it('should get DNA section', async() => {
    expect(await punk_dna.x_getDNASection(87654321, 1)).to.equal(21);
    expect(await punk_dna.x_getDNASection(87654321, 2)).to.equal(43);
    expect(await punk_dna.x_getDNASection(87654321, 3)).to.equal(65);
    expect(await punk_dna.x_getDNASection(87654321, 4)).to.equal(87);
    expect(await punk_dna.x_getDNASection(87654321, 5)).to.equal(0);
  })
});
