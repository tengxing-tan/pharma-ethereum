// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Stakeholder {
    struct Stakeholders {
        string email; // from database
        address metamaskAccount;
        uint registeredAt; // timestamp (input)
        uint verifiedAt; // timestamp
        bool isAuthentic;
    }
    mapping(address => Stakeholders) public stakeholders; // Mapping id to Stakeholders

    address payable public owner;

    constructor(uint _registeredAt) {
        stakeholders[msg.sender] = Stakeholders(
            "admin@pharm.com",
            msg.sender,
            _registeredAt,
            block.timestamp,
            true
        );
        console.log("Deployed Stakeholder contract, with address ", msg.sender);
        owner = payable(msg.sender);
    }

    // Function to add Stakeholders
    function addStakeholder(
        string memory _email,
        address _metaMaskAccount,
        uint _registeredAt // js Date.toLocalString()
    ) public payable returns (bool) {
        require(
            stakeholders[_metaMaskAccount].metamaskAccount != _metaMaskAccount,
            "Stakeholder already exists"
        );

        stakeholders[_metaMaskAccount] = Stakeholders(
            _email,
            _metaMaskAccount,
            _registeredAt,
            0, // to be verified
            false
        );

        return true;
    }

    // Function to get Stakeholders
    function getStakeholder(
        address _metaMaskAccount
    ) public view returns (Stakeholders memory) {
        return stakeholders[_metaMaskAccount];
    }

    // funtion to verify Stakeholders
    function verifyStakeholder(
        address _metaMaskAccount,
        bool _isAuthentic
    ) external payable {
        stakeholders[_metaMaskAccount].verifiedAt = block.timestamp;
        stakeholders[_metaMaskAccount].isAuthentic = _isAuthentic;
    }
}
