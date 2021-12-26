const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PlatziPunks", function () {
  let platzi_punks;
  beforeEach(async function(){
    const PlatziPunks = await ethers.getContractFactory("PlatziPunks");
    platzi_punks = await PlatziPunks.deploy(2);
    await platzi_punks.deployed();
  })

  it("Should init contract with name and symbol", async function () {
    expect(await platzi_punks.name()).to.equal("PlatziPunks");
    expect(await platzi_punks.symbol()).to.equal("PLPKS");
  });

  describe("When mint a token", async function (){
    let sender;
    beforeEach(async function() {
      [sender] = await ethers.getSigners();
    })

    it("Should increment the balanceof the sender by 1 every mint", async function () {
      expect(await platzi_punks.balanceOf(sender.address)).to.equal(0);
      await platzi_punks.mint()
      await platzi_punks.mint()
      expect(await platzi_punks.balanceOf(sender.address)).to.equal(2);
    });

    it("Should give the ownership of minted tokenId to the sender", async function () {
      await platzi_punks.mint()
      expect(await platzi_punks.ownerOf(0)).to.equal(sender.address);
    });

    it("Should increment tokenId in every mint", async function () {
      await platzi_punks.mint()
      expect(await platzi_punks.ownerOf(0)).to.equal(sender.address);
      await platzi_punks.mint()
      expect(await platzi_punks.ownerOf(1)).to.equal(sender.address);
    });
  }) 

  describe("Token Max supply", async function (){
    it("Should throw an error if minting exceeds the token max supply limit", async function () {
      try {
        await platzi_punks.mint()
        await platzi_punks.mint()
        await platzi_punks.mint()
        expect.fail('should throw a No Platzi Punks left :( error');
      } catch (error) {
        expect(error.message).to.contains('No Platzi Punks left :(');
      }
    });
  }) 
});
