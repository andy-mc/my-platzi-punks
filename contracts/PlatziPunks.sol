// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./PunkDNA.sol";
import "./Base64.sol";

contract PlatziPunks is ERC721, ERC721Enumerable, PunkDNA {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  uint256 public maxSupply;
  mapping(uint256 => uint256) public DnaByToken;

  constructor(uint256 _maxSupply) ERC721("PlatziPunks", "PLPKS") {
    maxSupply = _maxSupply;
  }

  function mint() public {
    _tokenIds.increment();

    uint256 newToeknId = _tokenIds.current();
    require(newToeknId <= maxSupply, 'No Platzi Punks left :(');

    DnaByToken[newToeknId] = deterministicPseudoRandomDNA(newToeknId, msg.sender);

    _safeMint(msg.sender, newToeknId);
  }

  function _baseURI() internal pure override returns (string memory) {
    return "https://avataaars.io/";
  }

  function _paramsURI(uint256 _dna) internal view returns (string memory) {
    string memory params;

    {
      params = string(
        abi.encodePacked(
            "accessoriesType=",
            getAccessoriesType(_dna),
            "&clotheColor=",
            getClotheColor(_dna),
            "&clotheType=",
            getClotheType(_dna),
            "&eyeType=",
            getEyeType(_dna),
            "&eyebrowType=",
            getEyeBrowType(_dna),
            "&facialHairColor=",
            getFacialHairColor(_dna),
            "&facialHairType=",
            getFacialHairType(_dna),
            "&hairColor=",
            getHairColor(_dna),
            "&hatColor=",
            getHatColor(_dna),
            "&graphicType=",
            getGraphicType(_dna),
            "&mouthType=",
            getMouthType(_dna),
            "&skinColor=",
            getSkinColor(_dna)
        )
      );
    }
    
    return string(abi.encodePacked(params, "&topType=", getTopType(_dna)));
  }
  
  function imageByDNA(uint256 _dna) public view returns(string memory) {
    string memory baseURI = _baseURI();
    string memory paramsURI = _paramsURI(_dna);

    return string(abi.encodePacked(baseURI, "?", paramsURI));
  }

  function tokenURI(uint256 tokenId)
    public 
    view 
    override 
    returns (string memory) 
  {
    require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
    
    string memory tokenIdString = Strings.toString(tokenId);

    uint256 _dna = DnaByToken[tokenId];
    string memory imageUrl = imageByDNA(_dna);

    string memory jsonUri = Base64.encode(
      abi.encodePacked(
        '{ "name": "PlatziPunks #', tokenIdString, '", ',
        '"description": "Platzi Punks are randomized Avataaars stored on chain to teach DApp development on Platzi", ',
        '"image": "',
        imageUrl,
        '" }'
      )
    );
      
    return string(abi.encodePacked("data:application/json;base64,", jsonUri));
  }

  // The following functions are overrides required by Solidity to support ERC721Enumerable ext.
  function _beforeTokenTransfer(address from, address to, uint256 tokenId)
      internal
      override(ERC721, ERC721Enumerable)
  {
      super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
      public
      view
      override(ERC721, ERC721Enumerable)
      returns (bool)
  {
      return super.supportsInterface(interfaceId);
  }
}