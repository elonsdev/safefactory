var web3 = new Web3(Web3.givenProvider);
// bnbtestnet
// https://data-seed-prebsc-1-s1.binance.org:8545

var instance;
var user;

var contract;

var lockercontract = "0x363b844c6208306a305E1A491A927440253D8c8C";

var contractOwner;

var _tokenaddress;

var fee = 0;

$(document).ready(function () {
  const loadtokenButton = document.querySelector('.enableLoadTokenButton');

  loadtokenButton.addEventListener('click', () => {
    //Will Start the metamask extension
    contract = $('#tokenaddress').val();

    window.ethereum.enable().then(function (accounts) {

      instance = new web3.eth.Contract(abi, contract, { from: accounts[0] });

      user = accounts[0];

      instance2 = new web3.eth.Contract(abi2, lockercontract, { from: accounts[0] });
      contractDetails();


    });
  });

});

async function contractDetails() {
  var _tokenaddress = $('#tokenaddress').val();
  var tokenname = await instance.methods.name().call();
  var totalsupply = await instance.methods.totalSupply().call();
  var decimals = await instance.methods.decimals().call();
  var totallocked = await instance2.methods.getTotalTokenBalance(_tokenaddress).call();
  var percentlocked = (totallocked / totalsupply) * 100;
  var balanceof = await instance.methods.balanceOf(user).call();

  $("#tokenname").text(tokenname);
  $("#tokensupply").text(totalsupply / (10**decimals));
  $("#totallocked").text(totallocked / (10**decimals));
  $("#percentlocked").text(percentlocked);
  $("#balanceof").text(balanceof / (10**decimals));
}

async function approveSpender() {
  var decimals = await instance.methods.decimals().call();
  var _address = "0x363b844c6208306a305E1A491A927440253D8c8C";
  var _amount = ( $('#spenderamount').val() * 10**decimals );
  console.log(_amount);
  try {
    await instance.methods.approve(_address, _amount).send();
  } catch (err) {
    console.log(err);
  }
};

async function lockTokens() {
  var decimals = await instance.methods.decimals().call();
  _tokenaddress = $('#tokenaddress').val();
  var _tokenamount = ($('#locktokenamount').val() * 10**decimals );
  var _unlocktime = $('#unlocktime').val();

  var amount = fee;

  console.log(decimals);
  console.log(_tokenaddress);
  console.log(_tokenamount);
  console.log(_unlocktime);
  try {
    await instance2.methods.lockTokens(_tokenaddress, _tokenamount, _unlocktime).send({ value: amount });
  } catch (err) {
    console.log(err);
  }
};

async function getDepositIDs() {

  window.ethereum.enable().then(async function (accounts) {


    user = accounts[0];

    instance2 = new web3.eth.Contract(abi2, lockercontract, { from: accounts[0] });
    contractDetails();

    var idsarray = await instance2.methods.getIdByUserAddress(user).call();
    $("#idsarray").text(idsarray);

    var arrayLength = idsarray.length;
    for (var i = 1; i <= arrayLength; i++) {
      var depositdetails = await instance2.methods.getDepositDetails(i).call();
        $.each(depositdetails, function(key, value){
              $("#unlocktimesarray").append(i + ": " + value + '<br>');
          });
    }

  });




};



async function withdrawTokens() {
  var _id = $('#withdrawidinput').val();
  try {
    await instance2.methods.withdrawTokens(_id).send();
  } catch (err) {
    console.log(err);
  }
};
