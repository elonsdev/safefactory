var web3 = new Web3(Web3.givenProvider);
// bnbtestnet
// https://data-seed-prebsc-1-s1.binance.org:8545

var instance;
var user;

// TokenFactory Contract
var contract = "0x48D99DAd21bc26cAc5ef43e58a6bC06B74802F2c";

var contractOwner;


instance = new web3.eth.Contract(abi, contract, { from: "0xB000000000000000000000000000000000000000" });
user = "0xB000000000000000000000000000000000000000";


$(document).ready(function () {
  const ethereumButton = document.querySelector('.enableEthereumButton');
  const showAccount = document.querySelector('.showAccount');
  ethereumButton.addEventListener('click', () => {
    //Will Start the metamask extension

    window.ethereum.enable().then(function (accounts) {

      instance = new web3.eth.Contract(abi, contract, { from: accounts[0] });

      user = accounts[0];
      var shortuser = user.substring(0, 8) + "...";
      showAccount.innerHTML = shortuser;
      $(".enableEthereumButton").hide();
      var buynow = "BUY NOW!"
      $("#buybutton").text(buynow);

      instance.events.TokenCreated()
      .on('data', (event) => {
        console.log(event);
        let contractcreated = event.returnValues.newTokenAddress;
        alert_msg("New token created at: <a href='https://bscscan.com/token/" + contractcreated + "'>" + contractcreated + "</a>"
          ,'success')
      })
      .on('error', console.error);
    });
  });

});

async function createToken() {
  var _name = $('#tokenname').val();
  var _symbol = $('#tokensymbol').val();
  var _totalsupply = $('#totalsupply').val();
  var _decimals = $('#decimals').val();
  var _maxtxamount = $('#sendlimit').val();
  var _taxfee = $('#taxfee').val();
  var _liquidityfee = $('#lpfee').val();
  var _numtokenstoselltoaddtoliquidity = $('#amountosell').val();
  var _extrafeewallet = $('#extrawallet').val();
  var _extrafeepercent = $('#extrafee').val();


  var amount = 500000000000000000;


  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var referer;

  if (urlParams.has('ref')) {
     referer = urlParams.get('ref')
  } else {
    referer = "0x1f6b72ad351A5D2FD73dD243eDb475a837E43026"; // sets referer to Bob if no referer.
  };
  console.log(referer);
  try {
    await instance.methods.createToken(_name, _symbol, _totalsupply, _decimals, _maxtxamount, _taxfee, _liquidityfee, _numtokenstoselltoaddtoliquidity, _extrafeewallet, _extrafeepercent, referer).send({ value: amount });
  } catch (err) {
    console.log(err);
  }
};

function alert_msg(content, type) {
    var str = '';
    str += '<div class="alert alert-' + type + ' fit-content mt-3" role="alert">' + content + '<button type="button" class="close ml-2" data-dismiss="alert" aria-label="Close"> <i class="far fa-times-circle"></i> </button></div>';
    $('#message').html(str)
}
