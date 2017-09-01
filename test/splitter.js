var Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', function(accounts) {

  var contract;
  var owner = accounts[0];
  var alice = accounts[0];
  var bob = accounts[1];
  var carol = accounts[2];
  

  beforeEach(function(){
      return Splitter.new()
     .then(instance => {contract = instance;
    });
  });

 it("should be owner", function(){
       contract.owner({from:owner})
      .then(_owner => {
        assert.strictEqual(_owner, owner, "not bob");
      });
 });


 it("should split", function(){
      var bobBalance;
      var carolBalance;
      var aliceBalance;
      var amountToSplit = 11;
      var refundAmt = amountToSplit % 2;
      var splitAmt = (amountToSplit-refundAmt)/2;
      

      return contract.getBalance(alice, {from:owner})
        .then(_aliceBalance => {
          aliceBalance = _aliceBalance;
          return contract.getBalance(bob, {from:owner})
        })
        .then(_bobBalance => {
          bobBalance = _bobBalance;
          return contract.getBalance(carol, {from:owner})
        })
        .then(_carolBalance =>{
          carolBalance = _carolBalance;
          return contract.split(bob, carol, {from:alice, value:amountToSplit})
        })
        .then(function(){
          return contract.getBalance(bob, {from:owner})
        })
        .then(function(bobNewBalance){
          assert.equal((bobBalance.add(splitAmt)).toString(10), (bobNewBalance).toString(10), "bob's split is incorrect");
          return contract.getBalance(carol, {from:owner})
        })
        .then(function(carolNewBalance){
          assert.equal((carolBalance.add(splitAmt)).toString(10), (carolNewBalance).toString(10), "carols's split is incorrect");
          return contract.getBalance(alice, {from:owner})
        })       
        .then(function(aliceNewBalance){
          assert.equal( (aliceBalance.add(refundAmt)).toString(10), (aliceNewBalance).toString(10), "alice's refund amt is incorrect");
        })
  });

  it("should withdraw", function(){
    // split amount then withdraw and check if balance is zero

    var amountToSplit = 11;
    var zeroBalance = 0;
    

    return contract.split(bob, carol, {from:alice, value:amountToSplit})
      .then(function(){
        // withdraw and check if balance is zero
        contract.withdraw({from:bob})
        return contract.getBalance(bob, {from:owner})
      })
      .then(function(bobNewBalance){
        assert.equal(zeroBalance.toString(10), (bobNewBalance).toString(10), "bob's balance is incorrect");
        contract.withdraw({from:carol})
        return contract.getBalance(carol, {from:owner})
      })
      .then(function(carolNewBalance){
        assert.equal(zeroBalance.toString(10), (carolNewBalance).toString(10), "carols's balance is incorrect");
        contract.withdraw({from:alice})
        return contract.getBalance(alice, {from:owner})
      })       
      .then(function(aliceNewBalance){
        assert.equal( zeroBalance.toString(10), (aliceNewBalance).toString(10), "alice's balance is incorrect");
      })
});


});
