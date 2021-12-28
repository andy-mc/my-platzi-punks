// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Base64.sol";

contract PlatziPunks is ERC721, ERC721Enumerable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  uint256 public maxSupply;

  constructor(uint256 _maxSupply) ERC721("PlatziPunks", "PLPKS") {
    maxSupply = _maxSupply;
  }

  function mint() public {
    _tokenIds.increment();

    uint256 newItemId = _tokenIds.current();
    require(newItemId <= maxSupply, 'No Platzi Punks left :(');

    _safeMint(msg.sender, newItemId);
  }
  
  function tokenURI(uint256 tokenId)
    public 
    view 
    override 
    returns (string memory) 
  {
    require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
    
    string memory tokenIdString = Strings.toString(tokenId);

    string memory jsonUri = Base64.encode(
      abi.encodePacked(
        '{ "name": "PlatziPunks #', tokenIdString, '", ',
        '"description": "Platzi Punks are randomized Avataaars stored on chain to teach DApp development on Platzi", ',
        '"image": "// TODO imageUrl" }'
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