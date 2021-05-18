var web3 = new Web3(Web3.givenProvider);
// bnbtestnet
// https://data-seed-prebsc-1-s1.binance.org:8545

var instance;
var user;

var contract;

var contractOwner;



$(document).ready(function () {
  const loadtokenButton = document.querySelector('.enableLoadTokenButton');
  const showAccount = document.querySelector('.showAccount');

  loadtokenButton.addEventListener('click', () => {
    //Will Start the metamask extension
    contract = $('#tokenaddress').val();

    window.ethereum.enable().then(function (accounts) {

      instance = new web3.eth.Contract(abi, contract, { from: accounts[0] });

      user = accounts[0];


      contractDetails();


    });
  });

});

async function contractDetails() {

  var tokenowner = await instance.methods.owner().call();
  var tokenname = await instance.methods.name().call();
  var symbol = await instance.methods.symbol().call();

  var totalsupply = await instance.methods.totalSupply().call();
  var decimals = await instance.methods.decimals().call();

  var maxtxamount = await instance.methods._maxTxAmount().call();
  var taxfee = await instance.methods._taxFee().call();
  var liquidityfee = await instance.methods._liquidityFee().call();
  var swapandliquify = await instance.methods.swapAndLiquifyEnabled().call();
  var bnboverflowbalance = await instance.methods.getBNBBalance().call();

  var extrafee = await instance.methods._extraFeePercent().call();
  var extrafeewallet = await instance.methods._extrafeewallet().call();

  $("#tokenowner").text(tokenowner);
  $("#tokenname").text(tokenname);
  $("#tokensymbol").text(symbol);
  $("#tokensupply").text(totalsupply / (10**decimals));
  $("#tokenmaxamount").text(maxtxamount / (10**decimals));
  $("#tokentaxfee").text(taxfee);
  $("#tokenliquidityfee").text(liquidityfee);
  $("#tokenswapeandliquifyenabled").text(swapandliquify);
  $("#tokenbnbbalance").text(bnboverflowbalance);
  $("#extrafee").text(extrafee);
  $("#extrafeewallet").text(extrafeewallet);
}

async function approveSpender() {
  var decimals = await instance.methods.decimals().call();
  var _address = $('#spenderaddress').val();
  var _amount = ( $('#spenderamount').val() * (10**decimals) );

  try {
    await instance.methods.approve(_address, _amount).send();
  } catch (err) {
    console.log(err);
  }
};

async function setLiquidityFee() {
  var _liquidityfee = $('#liquidityfee').val();
  try {
    await instance.methods.setLiquidityFeePercent(_liquidityfee).send();
  } catch (err) {
    console.log(err);
  }
};

async function setTaxFee() {
  var _taxfee = $('#taxfee').val();
  try {
    await instance.methods.setTaxFeePercent(_taxfee).send();
  } catch (err) {
    console.log(err);
  }
};

async function setTxPercent() {
  var _mxtxpercent = $('#mxtxpercent').val();
  try {
    await instance.methods.setMaxTxPercent(_mxtxpercent).send();
  } catch (err) {
    console.log(err);
  }
};

async function setExtraFee() {
  var _extrafeepercent = $('#extrafeepercent').val();
  try {
    await instance.methods.setExtraFeePercent(_extrafeepercent).send();
  } catch (err) {
    console.log(err);
  }
};

async function SwapAndLiquify() {
  var _swapandliquify = $('#swapandliquify').val();
  try {
    await instance.methods.setSwapAndLiquifyEnabled(_swapandliquify).send();
  } catch (err) {
    console.log(err);
  }
};

async function RenounceOwnership() {
  try {
    await instance.methods.renounceOwnership().send();
  } catch (err) {
    console.log(err);
  }
};

async function WithdrawBNB() {
  try {
    await instance.methods.withdrawOverFlowBNB().send();
  } catch (err) {
    console.log(err);
  }
};


function alert_msg(content, type) {
    var str = '';
    str += '<div class="alert alert-' + type + ' fit-content mt-3" role="alert">' + content + '<button type="button" class="close ml-2" data-dismiss="alert" aria-label="Close"> <i class="far fa-times-circle"></i> </button></div>';
    $('#message').html(str)
}
