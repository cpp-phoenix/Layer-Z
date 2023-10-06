// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
 
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
 
contract SoulBoundNFT is ERC721URIStorage, Ownable {
 
    uint256 private _tokenIdCounter;

    mapping(address => uint256) tokenToAddressMapping;
    mapping(uint256 => string) tokenToURIMapping;
 
    constructor() ERC721("SoulBound", "SBT") {}

    // function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
    //     internal
    //     override(ERC721)
    // {
    //     require(from == address(0), "Token not transferable");
    //     super._beforeTokenTransfer(from, to, tokenId, batchSize);
    // }
 
    function safeMint(address to, string memory _tokenURI) public onlyOwner {
        if(balanceOf(to) > 0) {
            revert("Already Minted");
        }
        _tokenIdCounter = _tokenIdCounter + 1;
        tokenToAddressMapping[to] = _tokenIdCounter;
        tokenToURIMapping[_tokenIdCounter] = _tokenURI;
        _safeMint(to, _tokenIdCounter);
    }
 
    // The following functions are overrides required by Solidity.
 
    // function _burn(uint256 tokenId) internal override(ERC721URIStorage) {
    //     revert("Operation Not Permitted");
    // }
 
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721URIStorage)
        returns (string memory)
    {
        return tokenToURIMapping[tokenId];
    }

    function tokenID(address _sender)
        public
        view
        returns (uint256)
    {
        return tokenToAddressMapping[_sender];
    }
}