// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Stakeholder {
    struct Stakeholders {
        string email; // from database
        address metamaskAccount;
        uint verifiedAt; // timestamp
    }

    mapping(address => Stakeholders) public stakeholders; // Mapping id to Stakeholders

    constructor() {
        stakeholders[msg.sender] = Stakeholders(
            "admin@pharm.com",
            msg.sender,
            block.timestamp
        );
        console.log("Deployed Stakeholder contract, with address ", msg.sender);
    }

    // Function to add Stakeholders
    function addStakeholders(
        string memory _email,
        address _metamaskAccount
    ) public {
        stakeholders[_metamaskAccount] = Stakeholders(
            _email,
            _metamaskAccount,
            block.timestamp
        );
    }

    // Function to get Stakeholders
    function getStakeholder(
        address _metamaskAccount
    ) public view returns (Stakeholders memory) {
        return stakeholders[_metamaskAccount];
    }
}
