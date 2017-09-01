pragma solidity ^0.4.6;

contract Splitter {
    address public owner;
    mapping(address => uint) balances;
    

    function Splitter() {
        owner = msg.sender;
    }

    function isAddress(address addr) 
    public 
    constant
    returns (bool success) 
    {
        // simple check for now. TODO: add more checks
        return addr != 0;
    }

    function split(address receiver1, address receiver2)
    public
    payable
    returns(bool success) 
    {
        if (receiver1 == receiver2) {revert();}
        if (!isAddress(receiver1)) {revert();}
        if (!isAddress(receiver2)) {revert();}
        if (msg.value == 0) {revert();}

        uint amtToSplit = msg.value;
        
        // if odd amount is sent, refund remaining amt to sender
        if (amtToSplit % 2 == 0) {
            balances[receiver1] += amtToSplit/2;
            balances[receiver2] += amtToSplit/2;
        } else {
            uint refundAmt = amtToSplit % 2;
            amtToSplit = amtToSplit - refundAmt;
            balances[receiver1] += amtToSplit/2;
            balances[receiver2] += amtToSplit/2;
            balances[msg.sender] += refundAmt;
        }

        return true;
    }

    function getBalance(address target)
    public
    constant
    returns(uint amount)
    {
        uint balance = 0;
        if (isAddress(target)) {balance = balances[target];}
        return balance;
    }

    function withdraw()
    public
    returns (bool success)
    {
        address sender = msg.sender;
        uint balance = getBalance(sender);
        if (balance > 0) {
            balances[sender] = 0;
            sender.transfer(balance);
        }
        return true;
    }

    function kill() {
        if (msg.sender == owner) {selfdestruct(owner);}
    }
}