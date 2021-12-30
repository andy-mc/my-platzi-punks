const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PlatziPunks", function () {
  let platzi_punks;
  let sender;
  let PseudoRandomDNA;

  beforeEach(async function(){
    const PlatziPunks = await ethers.getContractFactory("XPlatziPunks");
    platzi_punks = await PlatziPunks.deploy(2);
    await platzi_punks.deployed();

    [sender] = await ethers.getSigners();
    PseudoRandomDNA = await platzi_punks.deterministicPseudoRandomDNA(1, sender.address)
  })

  it("Should init contract with name and symbol", async function () {
    expect(await platzi_punks.name()).to.equal("PlatziPunks");
    expect(await platzi_punks.symbol()).to.equal("PLPKS");
  });

  describe("When mint a token", async function (){
    it("Should increment the balanceof the sender by 1 every mint", async function () {
      expect(await platzi_punks.balanceOf(sender.address)).to.equal(0);
      await platzi_punks.mint()
      await platzi_punks.mint()
      expect(await platzi_punks.balanceOf(sender.address)).to.equal(2);
    });

    it("Should give the ownership of minted tokenId to the sender", async function () {
      await platzi_punks.mint()
      expect(await platzi_punks.ownerOf(1)).to.equal(sender.address);
    });

    it("Should increment tokenId in every mint", async function () {
      await platzi_punks.mint()
      expect(await platzi_punks.ownerOf(1)).to.equal(sender.address);
      await platzi_punks.mint()
      expect(await platzi_punks.ownerOf(1)).to.equal(sender.address);
    });

    it("Should save token dna on DnaByToken", async function () {
      await platzi_punks.mint()
      expect(await platzi_punks.DnaByToken(1).toString().length).to.equal(16);
      expect(await platzi_punks.DnaByToken(1)).to.equal(PseudoRandomDNA);
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
        await platzi_punks.tokenURI(1)
        expect.fail('fail with an error');
      } catch (error) {
        expect(error.message).to.contains('ERC721Metadata: URI query for nonexistent token');
      }
    });
    
    it("Should return the correct tokenURI protocol mime type", async function () {
        await platzi_punks.mint()
        expect(await platzi_punks.tokenURI(1)).to.includes("data:application/json;base64,");
    });

    it("Should name token with correct number based on tokenId", async function () {
      await platzi_punks.mint()
      await platzi_punks.mint()

      const punk_token_1 = await platzi_punks.tokenURI(1)
      const punk_token_2 = await platzi_punks.tokenURI(2)

      var punk_token_1_data = Buffer.from(punk_token_1.split(',')[1], 'base64').toString('ascii');
      var punk_token_2_data = Buffer.from(punk_token_2.split(',')[1], 'base64').toString('ascii');
      
      expect(punk_token_1_data).to.includes('{ "name": "PlatziPunks #1"');
      expect(punk_token_1_data).to.includes('"image": "https://avataaars.io/?accessoriesType');
      expect(punk_token_1_data).to.includes('&topType=');

      expect(punk_token_2_data).to.includes('{ "name": "PlatziPunks #2"');
      expect(punk_token_2_data).to.includes('"image": "https://avataaars.io/?accessoriesType');
      expect(punk_token_2_data).to.includes('&topType=');
    });

    it("Should have _baseUri avataaars.io", async function () {
      expect(await platzi_punks.x_baseURI()).to.equal('https://avataaars.io/');
    });

    it("Should get _paramsURI", async function () {
      expect(await platzi_punks.x_paramsURI(PseudoRandomDNA)).to.contains('accessoriesType=');
      expect(await platzi_punks.x_paramsURI(PseudoRandomDNA)).to.contains('topType=');
    });

    it("Should get imageByDNA", async function () {
      expect(await platzi_punks.imageByDNA(PseudoRandomDNA)).to.contains('https://avataaars.io/?');
      expect(await platzi_punks.imageByDNA(PseudoRandomDNA)).to.contains('accessoriesType=');
      expect(await platzi_punks.imageByDNA(PseudoRandomDNA)).to.contains('topType=');
    });
  })
});
