// SPDX-License-Identifier: MIT
pragma solidity 0.8.37;

import "../lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";

/**
 * @title MyNFT
 * @dev Production-ready ERC721 NFT contract configured for the Bohr Testnet (Chain ID 968).
 * Native Token: BOT (18 decimals), Total Supply: 150 Million.
 */
contract MyNFT is ERC721URIStorage, Ownable {
    /// @notice Maximum total supply (150 Million tokens)
    uint256 public constant MAX_SUPPLY = 150_000_000;

    /// @notice Price per mint in native BOT tokens (18 decimals)
    uint256 public mintPrice = 0.01 ether;

    /// @notice Running counter of minted tokens
    uint256 private _nextTokenId = 1;

    /// @notice Total number of minted NFTs
    uint256 public totalMinted;

    /// @notice Base URI for token metadata
    string private _baseTokenURI;

    // Custom Errors
    error ExceedsMaxSupply();
    error InsufficientPayment(uint256 required, uint256 provided);
    error InvalidQuantity();
    error WithdrawFailed();
    error ZeroAddress();

    // Events
    event NFTMinted(address indexed recipient, uint256 indexed tokenId, string tokenURI);
    event MintPriceUpdated(uint256 oldPrice, uint256 newPrice);
    event BaseURIUpdated(string newBaseURI);
    event FundsWithdrawn(address indexed recipient, uint256 amount);

    /**
     * @dev Constructor initializes the NFT collection with name, symbol, base URI, and initial owner.
     * @param name_ Collection name
     * @param symbol_ Collection symbol
     * @param baseURI_ Default base URI for metadata
     * @param initialOwner Address of contract owner
     */
    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseURI_,
        address initialOwner
    ) ERC721(name_, symbol_) Ownable(initialOwner) {
        if (initialOwner == address(0)) revert ZeroAddress();
        _baseTokenURI = baseURI_;
    }

    /**
     * @notice Public mint function with native BOT payment.
     * @param recipient Address receiving the minted NFT
     * @param uri Metadata URI for this token (optional if baseURI is set)
     * @return tokenId The ID of the newly minted NFT
     */
    function mint(address recipient, string memory uri) public payable returns (uint256) {
        if (recipient == address(0)) revert ZeroAddress();
        if (totalMinted >= MAX_SUPPLY) revert ExceedsMaxSupply();

        // Check payment for non-owner calls
        if (msg.sender != owner()) {
            if (msg.value < mintPrice) {
                revert InsufficientPayment(mintPrice, msg.value);
            }
        }

        uint256 tokenId = _nextTokenId++;
        totalMinted++;

        emit NFTMinted(recipient, tokenId, uri);

        _safeMint(recipient, tokenId);
        if (bytes(uri).length > 0) {
            _setTokenURI(tokenId, uri);
        }

        // Refund any excess native BOT sent
        if (msg.value > mintPrice && msg.sender != owner()) {
            uint256 excess = msg.value - mintPrice;
            (bool refundSuccess, ) = payable(msg.sender).call{value: excess}("");
            require(refundSuccess, "Refund failed");
        }

        return tokenId;
    }

    /**
     * @notice Batch mint multiple NFTs in a single transaction.
     * @param recipient Address receiving the minted NFTs
     * @param count Number of NFTs to mint
     */
    function mintBatch(address recipient, uint256 count) external payable {
        if (recipient == address(0)) revert ZeroAddress();
        if (count == 0) revert InvalidQuantity();
        if (totalMinted + count > MAX_SUPPLY) revert ExceedsMaxSupply();

        uint256 totalCost = mintPrice * count;
        if (msg.sender != owner()) {
            if (msg.value < totalCost) {
                revert InsufficientPayment(totalCost, msg.value);
            }
        }

        for (uint256 i = 0; i < count; i++) {
            uint256 tokenId = _nextTokenId++;
            totalMinted++;
            emit NFTMinted(recipient, tokenId, "");
            _safeMint(recipient, tokenId);
        }

        // Refund excess
        if (msg.value > totalCost && msg.sender != owner()) {
            uint256 excess = msg.value - totalCost;
            (bool refundSuccess, ) = payable(msg.sender).call{value: excess}("");
            require(refundSuccess, "Refund failed");
        }
    }

    /**
     * @notice Free minting restricted to contract owner.
     * @param recipient Address receiving the minted NFT
     * @param uri Metadata URI for this token
     * @return tokenId The ID of the newly minted NFT
     */
    function ownerMint(address recipient, string memory uri) external onlyOwner returns (uint256) {
        if (recipient == address(0)) revert ZeroAddress();
        if (totalMinted >= MAX_SUPPLY) revert ExceedsMaxSupply();

        uint256 tokenId = _nextTokenId++;
        totalMinted++;

        emit NFTMinted(recipient, tokenId, uri);

        _safeMint(recipient, tokenId);
        if (bytes(uri).length > 0) {
            _setTokenURI(tokenId, uri);
        }

        return tokenId;
    }

    /**
     * @notice Set a new mint price in native BOT tokens.
     * @param newPrice New price in wei (BOT token units)
     */
    function setMintPrice(uint256 newPrice) external onlyOwner {
        uint256 oldPrice = mintPrice;
        mintPrice = newPrice;
        emit MintPriceUpdated(oldPrice, newPrice);
    }

    /**
     * @notice Set a new base metadata URI.
     * @param newBaseURI New base URI string
     */
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    /**
     * @dev Internal helper returning the base metadata URI.
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @notice Returns token URI: returns custom URI if set, otherwise falls back to baseURI + tokenId.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireOwned(tokenId);

        string memory customURI = _suffixURI(tokenId);
        if (bytes(customURI).length > 0) {
            return customURI;
        }
        return super.tokenURI(tokenId);
    }

    /**
     * @notice Withdraw accumulated native BOT tokens to designated recipient.
     * @param recipient Address to receive the contract funds
     */
    function withdraw(address payable recipient) external onlyOwner {
        if (recipient == address(0)) revert ZeroAddress();
        uint256 balance = address(this).balance;
        if (balance == 0) revert WithdrawFailed();

        emit FundsWithdrawn(recipient, balance);

        (bool success, ) = recipient.call{value: balance}("");
        if (!success) revert WithdrawFailed();
    }

    /**
     * @notice Helper function returning current total supply.
     */
    function totalSupply() external view returns (uint256) {
        return totalMinted;
    }
}
