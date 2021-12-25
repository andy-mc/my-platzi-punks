//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Greeter {
    string private greeting;
    string private name;

    constructor(string memory _greeting, string memory _name) {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
        name = _name;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function greetName() public view returns (string memory) {
        return string(abi.encodePacked("Hello, ", name, "!"));
    }

    function setGreeting(string memory _greeting) public {
        console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        greeting = _greeting;
    }
}
