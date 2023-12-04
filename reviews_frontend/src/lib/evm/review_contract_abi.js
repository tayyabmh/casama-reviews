export const reviewContractAbi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "approveFakeUSD",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fakeUSDAddress",
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
            "internalType": "string",
            "name": "review",
            "type": "string"
          },
          {
            "internalType": "uint8",
            "name": "rating",
            "type": "uint8"
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
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "performPaymentAndInitiateReview",
    "outputs": [],
    "stateMutability": "payable",
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
        "internalType": "string",
        "name": "review",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "rating",
        "type": "uint8"
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