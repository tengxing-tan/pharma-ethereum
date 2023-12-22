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
    address payable public owner;

    event Withdrawal(uint amount, uint when);

    mapping(address => Stakeholders) public stakeholders; // Mapping id to Stakeholders

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
        address _metamaskAccount,
        uint _registeredAt // js Date.toLocalString()
    ) public payable returns (bool) {
        require(
            stakeholders[_metamaskAccount].metamaskAccount != _metamaskAccount,
            "Stakeholder already exists"
        );

        stakeholders[_metamaskAccount] = Stakeholders(
            _email,
            _metamaskAccount,
            _registeredAt,
            0, // to be verified
            false
        );

        withdraw();

        return true;
    }

    // Function to get Stakeholders
    function getStakeholder(
        address _metamaskAccount
    ) public view returns (Stakeholders memory) {
        return stakeholders[_metamaskAccount];
    }

    // funtion to verify Stakeholders
    function verifyStakeholder(
        address _metamaskAccount,
        bool _isAuthentic
    ) public returns (bool) {
        stakeholders[_metamaskAccount].verifiedAt = block.timestamp;
        stakeholders[_metamaskAccount].isAuthentic = _isAuthentic;

        return true;
    }

    function withdraw() public {
        require(msg.sender == owner, "You aren't the owner");
        emit Withdrawal(address(this).balance, block.timestamp);
        owner.transfer(address(this).balance);
    }
}
