const { expect } = require("chai");

describe.only("Platzi Punks Contract", function () {
  const setup = async (_maxSupply = 2, tokenId = 1) => {
    const PlatziPunks = await ethers.getContractFactory("XPlatziPunks");
    const platzi_punks = await PlatziPunks.deploy(_maxSupply);
    await platzi_punks.deployed();
    
    const [owner] = await ethers.getSigners();
    const PseudoRandomDNA = await platzi_punks.deterministicPseudoRandomDNA(tokenId, owner.address)
    
    return {
      platzi_punks,
      owner,
      PseudoRandomDNA
    }
  }

  let platzi_punks;
  let owner;
  let PseudoRandomDNA;
  beforeEach(async () => {
    const test_utils = await setup();
    platzi_punks = test_utils.platzi_punks
    owner = test_utils.owner
    PseudoRandomDNA = test_utils.PseudoRandomDNA
  })

  describe("Deployment", () => {
    it("Should init contract with name and symbol", async () => {
      expect(await platzi_punks.name()).to.equal("PlatziPunks");
      expect(await platzi_punks.symbol()).to.equal("PLPKS");
    });

    it("Should init max supply with pass params", async () => {
      const maxSupply = 150;
      const {platzi_punks} = await setup(maxSupply);
      expect(await platzi_punks.maxSupply()).to.equal(maxSupply);
    });
  })

  describe("Minting", async () => {
    it("Mints a new token and assigns it to owner", async () => {
      await platzi_punks.mint();
      expect(await platzi_punks.ownerOf(1)).to.equal(owner.address);
    });

    it("Has a minting limit", async () => {      
      const {platzi_punks} = await setup(2);

      try {
        // Exceeds minting
        await platzi_punks.mint()
        await platzi_punks.mint()
        await platzi_punks.mint()
        expect.fail('fail with an error');
      } catch (error) {
        expect(error.message).to.contains('No Platzi Punks left :(');
      }
    });

    it("Should increment the balanceof the owner by 1 every mint", async () => {
      expect(await platzi_punks.balanceOf(owner.address)).to.equal(0);
      await platzi_punks.mint()
      await platzi_punks.mint()
      expect(await platzi_punks.balanceOf(owner.address)).to.equal(2);
    });

    it("Should increment tokenId in every mint", async () => {
      await platzi_punks.mint()
      expect(await platzi_punks.ownerOf(1)).to.equal(owner.address);
      await platzi_punks.mint()
      expect(await platzi_punks.ownerOf(2)).to.equal(owner.address);
    });

    it("Should save token dna on DnaByToken", async () => {
      await platzi_punks.mint()
      expect(await platzi_punks.DnaByToken(1).toString().length).to.equal(16);
      expect(await platzi_punks.DnaByToken(1)).to.equal(PseudoRandomDNA);
    });
  }) 

  describe("tokenURI", async () => {
    it("Should throw an error if tokenId don't exists", async () => {
      try {
        await platzi_punks.tokenURI(1)
        expect.fail('fail with an error');
      } catch (error) {
        expect(error.message).to.contains('ERC721Metadata: URI query for nonexistent token');
      }
    });

    it.only("Should name token with correct number based on tokenId", async () => {
      await platzi_punks.mint()

      const tokenURI = await platzi_punks.tokenURI(1)
      const [ prefix, base64JSON ] = tokenURI.split(',')
      const stringifiedMetaData = Buffer.from(base64JSON, 'base64').toString('ascii');
      const metadata = JSON.parse(stringifiedMetaData)

      expect(prefix).to.equal("data:application/json;base64");
      expect(metadata).to.have.all.keys("name", "description", "image")

      expect(metadata.name).to.includes('PlatziPunks #1');
      expect(metadata.image).to.includes('https://avataaars.io/?')
      expect(metadata.image).to.includes('accessoriesType=')
      expect(metadata.image).to.includes('topType=')
    });

    it("Should have _baseUri avataaars.io", async () => {
      expect(await platzi_punks.x_baseURI()).to.equal('https://avataaars.io/');
    });

    it("Should get _paramsURI", async () => {
      expect(await platzi_punks.x_paramsURI(PseudoRandomDNA)).to.contains('accessoriesType=');
      expect(await platzi_punks.x_paramsURI(PseudoRandomDNA)).to.contains('topType=');
    });

    it("Should get imageByDNA", async () => {
      expect(await platzi_punks.imageByDNA(PseudoRandomDNA)).to.contains('https://avataaars.io/?');
      expect(await platzi_punks.imageByDNA(PseudoRandomDNA)).to.contains('accessoriesType=');
      expect(await platzi_punks.imageByDNA(PseudoRandomDNA)).to.contains('topType=');
    });
  })
});
