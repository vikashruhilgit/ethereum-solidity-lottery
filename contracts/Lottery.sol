// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Ballot
 * @dev Implements voting process along with vote delegation
 */
contract Lottery {
    address public owner;
    address payable[] private players;

    constructor() {
        owner = msg.sender;
    }

    function register() public payable {
        require(
            msg.value > .0001 ether,
            "registration value must be greater then 0001 ether"
        );
        players.push(payable(msg.sender));
    }

    function rendom(uint maxIndx) private view returns (uint) {
        return
            uint(
                keccak256(
                    abi.encodePacked(block.prevrandao, block.timestamp, players)
                )
            ) % maxIndx;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function lotteryBalance() public view returns (uint) {
        return address(this).balance;
    }

    modifier restricted() {
        require(
            msg.sender == owner,
            "access denied, only owner has access to this."
        );
        _;
    }

    function winner() public payable restricted {
        uint index = rendom(players.length);
        players[index].transfer(address(this).balance);
        delete players;

        // alternate way to pay balance
        /* (bool success,) = payable(players[index]).call{value: address(this).balance}(""); 
        require(success, "transaction failed"); */
    }
}
