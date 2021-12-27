// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Base64.sol";

contract PlatziPunks is ERC721, ERC721Enumerable {
  using Counters for Counters.Counter;

  uint256 public maxSupply;
  Counters.Counter private _tokenCounter;

  constructor(uint256 _maxSupply) ERC721("PlatziPunks", "PLPKS") {
    maxSupply = _maxSupply;
  }

  function mint() public {
    uint256 tokenId = _tokenCounter.current();
    require(tokenId < maxSupply, 'No Platzi Punks left :(');

    _safeMint(msg.sender, tokenId);
    _tokenCounter.increment();
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