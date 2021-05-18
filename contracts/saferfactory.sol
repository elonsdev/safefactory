pragma solidity ^0.6.12;

import "./PODH.sol";

contract CloneFactory {

  function createClone(address target) internal returns (address payable result) {
    bytes20 targetBytes = bytes20(target);
    assembly {
      let clone := mload(0x40)
      mstore(clone, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
      mstore(add(clone, 0x14), targetBytes)
      mstore(add(clone, 0x28), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
      result := create(0, clone, 0x37)
    }
  }

  function isClone(address target, address query) internal view returns (bool result) {
    bytes20 targetBytes = bytes20(target);
    assembly {
      let clone := mload(0x40)
      mstore(clone, 0x363d3d373d3d3d363d7300000000000000000000000000000000000000000000)
      mstore(add(clone, 0xa), targetBytes)
      mstore(add(clone, 0x1e), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)

      let other := add(clone, 0x40)
      extcodecopy(query, other, 0, 0x2d)
      result := and(
        eq(mload(clone), mload(other)),
        eq(mload(add(clone, 0xd)), mload(add(other, 0xd)))
      )
    }
  }
}


contract TokenFactory is Ownable, CloneFactory {

  address payable public masterContract = 0x2A654BCe79519B698F9142F651Ac95E97809B2Cc;
  address payable public moonfactoryboss = 0x1f6b72ad351A5D2FD73dD243eDb475a837E43026;
  address payable public moonfactoryreferer;

  uint256 public fee = 1000000000000000000;

  address newCloneOwner;

  event TokenCreated(address newTokenAddress);


  function createToken(string memory _name, string memory _symbol,uint256 _totalsupply, uint8 _decimals, uint256 _maxtxamount, uint256 _taxfee, uint256 _liquidityfee, uint256 _numtokenstoselltoaddtoliquidity, address _extrafeewallet, uint256 _extrafeepercent, address payable _moonfactoryrefere) public payable {
    require(msg.value == fee, "you must pay the fee");
    address payable clone = createClone(masterContract);
    newCloneOwner = msg.sender;
    initializedBep20(clone).init(_name, _symbol, _totalsupply, _decimals, _maxtxamount, _taxfee, _liquidityfee, _numtokenstoselltoaddtoliquidity, _extrafeewallet, _extrafeepercent, newCloneOwner);
    emit TokenCreated(clone);

    moonfactoryreferer = _moonfactoryrefere;
    _forwardFunds(); // Sends fee to moonfactoryboss
  }

  function changeFee(uint256 _fee) public onlyOwner {
      fee = _fee;
  }

  function _forwardFunds() internal {
        uint256 split = msg.value / 2;
        moonfactoryreferer.transfer(split);
        moonfactoryboss.transfer(split);
    }
}
