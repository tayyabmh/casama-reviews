// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@tableland/evm/contracts/ITablelandTables.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";

import "hardhat/console.sol";

contract Reviews is ERC721Holder, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _reviewIds;

    ITablelandTables private _tableland;
    string public _reviewsTable;
    uint256 public _reviewsTableId;
    string private _reviewsTablePrefix = 'casamareviews';

    enum ReviewStatus { Pending, Completed, Expired }

    struct Review {
        uint256 reviewId;
        address reviewerAddress;
        address reviewedAddress;
        ReviewStatus status;
    }

    mapping(uint256 => Review) public reviews;

    constructor(address _registry) {


        // Set the tableland registry
        _tableland = ITablelandTables(_registry);

        // Create reviews table
        _reviewsTableId = _tableland.createTable(
            address(this),
            string.concat(
                "CREATE TABLE ",
                _reviewsTablePrefix,
                "_",
                Strings.toString(block.chainid),
                " (id integer primary key, reviewerAddress text, reviewedAddress text, review text, rating integer, associatedTransactionHash text, status text)"
            )
        );

        // Set the reviews table name
        _reviewsTable = string.concat(
            _reviewsTablePrefix,
            "_",
            Strings.toString(block.chainid),
            "_",
            Strings.toString(_reviewsTableId)
        );
    }

    // TODO: Add an "attributes" field to the reviews table
    function initiateReviewForTransaction(address _to, string memory _transactionHash) public {
        // First create the payer to recipient review, first we need to do this on Tableland
        _tableland.runSQL(
            address(this),
            _reviewsTableId,
            SQLHelpers.toInsert(
                _reviewsTablePrefix,
                _reviewsTableId,
                // Column Names
                "reviewerAddress, reviewedAddress, review, rating, associatedTransactionHash, status",
                // Values
                string.concat(
                    SQLHelpers.quote(Strings.toHexString(msg.sender)), ", ",
                    SQLHelpers.quote(Strings.toHexString(_to)), ", ",
                    SQLHelpers.quote(" "), ", ",
                    "0", ", ",
                    SQLHelpers.quote(_transactionHash), ", ",
                    SQLHelpers.quote("Pending")
                )
            )
        );

        // But we also need to create the review on the contract
        _reviewIds.increment();
        uint256 newReviewId = _reviewIds.current();
        reviews[newReviewId] = Review({
            reviewId: newReviewId,
            reviewerAddress: msg.sender,
            reviewedAddress: _to,
            status: ReviewStatus.Pending
        });

        // Then create the recipient to payer review
        _tableland.runSQL(
            address(this),
            _reviewsTableId,
            SQLHelpers.toInsert(
                _reviewsTablePrefix,
                _reviewsTableId,
                // Column Names
                "reviewerAddress, reviewedAddress, review, rating, associatedTransactionHash, status",
                // Values
                string.concat(
                    SQLHelpers.quote(Strings.toHexString(_to)),  ", ",
                    SQLHelpers.quote(Strings.toHexString(msg.sender)), ", ",
                    SQLHelpers.quote(" "), ", ",
                    "0", ", ",
                    SQLHelpers.quote(_transactionHash), ", ",
                    SQLHelpers.quote("Pending")
                )
            )
        );

        // But we also need to create the review on the contract
        _reviewIds.increment();
        newReviewId = _reviewIds.current();
        reviews[newReviewId] = Review({
            reviewId: newReviewId,
            reviewerAddress: _to,
            reviewedAddress: msg.sender,
            status: ReviewStatus.Pending
        });

    }

    function updateReview(uint256 _reviewId, string memory _review, uint8 _rating) public {
        require(reviews[_reviewId].reviewerAddress == msg.sender, "Only the reviewer can update the review");
        require(reviews[_reviewId].status == ReviewStatus.Pending, "This review has already been completed or expired");
        require(reviews[_reviewId].reviewedAddress != address(0), "This review does not exist");
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");

        // Update the review
        _tableland.runSQL(
            address(this),
            _reviewsTableId,
            SQLHelpers.toUpdate(
                _reviewsTablePrefix,
                _reviewsTableId,
                // Setters
                string.concat(
                    "review = ", SQLHelpers.quote(_review), ", ",
                    "rating = ", Strings.toString(_rating), ", ",
                    "status = ", SQLHelpers.quote("Completed")
                ),
                // Where clause
                string.concat(
                    "id = ", SQLHelpers.quote(Strings.toString(_reviewId))
                )
                )
            );

    }

    function getReviewDetails(uint256 _reviewId) public view returns (Review memory) {
        return reviews[_reviewId];
    }

    function getReviewCount() public view returns (uint256) {
        return _reviewIds.current();
    }

}
