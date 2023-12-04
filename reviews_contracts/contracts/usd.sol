// SPDX-License-Identifier: MIT


pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract FAKE_USD is ERC20 {
    constructor() ERC20("FakeUSD", "FUSD") {
        _mint(0x52A08Ac5182dc1f7e96F78276fDdB1f53B0d6724, 1000000000000000000000000);
    }
}