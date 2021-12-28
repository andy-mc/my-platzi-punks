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
        expect.fail('fail with an error');
      } catch (error) {
        expect(error.message).to.contains('No Platzi Punks left :(');
      }
    });
  }) 

  describe("tokenURI", async function () {
    it("Should throw an error if tokenId don't exists", async function () {
      try {
        await platzi_punks.tokenURI(0)
        expect.fail('fail with an error');
      } catch (error) {
        expect(error.message).to.contains('ERC721Metadata: URI query for nonexistent token');
      }
    });
    
    it("Should return the correct tokenURI protocol mime type", async function () {
        await platzi_punks.mint()
        expect(await platzi_punks.tokenURI(0)).to.includes("data:application/json;base64,");
    });

    it("Should name token with correct number based on tokenId", async function () {
      await platzi_punks.mint()
      await platzi_punks.mint()
      
      console.log('platzi_punks.tokenURI(0):', await platzi_punks.tokenURI(0))
      expect(await platzi_punks.tokenURI(0)).to.includes(Buffer.from('{ "name": "PlatziPunks #0"').toString('base64').slice(0, -1));
      expect(await platzi_punks.tokenURI(1)).to.includes(Buffer.from('{ "name": "PlatziPunks #1"').toString('base64').slice(0, -1));
    });
  })
  
});
