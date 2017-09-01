pragma solidity ^0.4.6;

contract Splitter {
    
    address public owner;
    mapping(address => uint) public balances;
    
    function Splitter() {
        owner = msg.sender;
    }

    function split(address receiver1, address receiver2)
    public
    payable
    returns(bool success) 
    {
        if (msg.value == 0) {revert();}

        uint amtToSplit = msg.value;
        // if odd amount is sent, refund remaining amt to sender
        uint refundAmt = amtToSplit % 2;
        amtToSplit = amtToSplit - refundAmt;
        balances[receiver1] += amtToSplit/2;
        balances[receiver2] += amtToSplit/2;
         // 0 will be refunded if amount is even. conditional check can be added to save gas
        balances[msg.sender] += refundAmt;
        return true;
    }

    function withdraw()
    public
    returns (bool success)
    {
        uint balance = balances[msg.sender];
        if (balance == 0) {revert();}
        
        balances[msg.sender] = 0;
        msg.sender.transfer(balance);
        return true;
    }

    function kill() {
        if (msg.sender == owner) {selfdestruct(owner);}
    }
}