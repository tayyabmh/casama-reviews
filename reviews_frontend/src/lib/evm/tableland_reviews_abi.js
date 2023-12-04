export const TABLELAND_REVIEWS_CONTRACT_MUMBAI = "0xCf446c0e4399274c68d3F9393Bc4749321131427";
export const TABLELAND_REVIEWS_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_registry",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "_reviewsTable",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_reviewsTableId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getReviewCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_reviewId",
        "type": "uint256"
      }
    ],
    "name": "getReviewDetails",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "reviewId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "reviewerAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "reviewedAddress",
            "type": "address"
          },
          {
            "internalType": "enum Reviews.ReviewStatus",
            "name": "status",
            "type": "uint8"
          }
        ],
        "internalType": "struct Reviews.Review",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_to",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_transactionHash",
        "type": "string"
      }
    ],
    "name": "initiateReviewForTransaction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "name": "onERC721Received",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "reviews",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "reviewId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "reviewerAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "reviewedAddress",
        "type": "address"
      },
      {
        "internalType": "enum Reviews.ReviewStatus",
        "name": "status",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_reviewId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_review",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "_rating",
        "type": "uint8"
      }
    ],
    "name": "updateReview",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]