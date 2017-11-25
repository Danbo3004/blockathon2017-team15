window.CONFIG = {};
// Import the page's CSS. Webpack will know what to do with it.
import "../css/app.css";
// Import libraries we need.
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract'
// var Wallet = require('ethereumjs-wallet');
import Wallet from 'ethereumjs-wallet'
import QR from 'qr-image'
import loyalty_artifacts from '../../build/contracts/Loyalty.json'
var Loyalty = contract(loyalty_artifacts);

window.displayQrCode = function (text) {
  var svg_string = QR.imageSync(text, { type: 'svg' });
  $('#address_image').html(svg_string);
  $('#address').html(text);
}

window.updateBalance = function (balance) {
  $('#userBalance').text(balance);
  $('#userBalance').parent().removeClass('hide');
}

window.login = function () {
  if ($('#passphrase').val() != '123123') {
    return false;
  }
}

window.createNewAccount = function () {
  var wallet = Wallet.generate();
  console.log('0x' + wallet.getPrivateKey().toString('hex'));
  console.log('0x' + wallet.getAddress().toString('hex'));
  //$('#publicKey').val(wallet.getAddress().toString('hex'));
  //$('#privateKey').val(wallet.getPrivateKey().toString('hex'));

  localStorage.setItem("publicKey", wallet.getAddress().toString('hex'));
  localStorage.setItem("privateKey", wallet.getPrivateKey().toString('hex'));
}

window.rewardToken = function () {
  try {
    Loyalty.deployed().then(function (instance) {
      instance.rewardToken(CONFIG.userAddress, 40, {from: CONFIG.retailerAddress }).then(function (rs) {
        window.location.href = "./earn-success.html";
      });
    });
  } catch (err) {
    console.log(err);
  }
}

window.confirmRedeem = function() {
  try {
    Loyalty.deployed().then(function (instance) {
      instance.redeemToken(CONFIG.retailerAddress, {from: CONFIG.userAddress}).then(function (rs) {
        window.location.href = './redeem-success.html';
      });
    });
  } catch (err) {
    console.log(err);
  }
}

window.addRetailer = function () {
  try {
    Loyalty.deployed().then(function (instance) {
      instance.addRetailer(CONFIG.retailerAddress,{from: CONFIG.ownerAddress}).then(function (rs) {
        console.log(rs);
      });
    });
  } catch (err) {
    console.log(err);
  }
}

window.getBalanceToken = function (_address) {
  Loyalty.deployed().then(function (instance) {
    instance.balanceOf.call(_address)
      .then((rs) => {
        console.log(rs);
        updateBalance(rs.toString());
        console.log('value balance :'+ rs.toString());
      });
  })
}

$(document).ready(function () {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected `currentProvider` from external source like Metamask")
    window.web3 = new Web3(web3.currentProvider);
  } else {
    // fallback to local provider
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  web3.eth.getAccounts((error, accounts) => {
    console.log(accounts);
    CONFIG.ownerAddress = accounts[0];
    CONFIG.retailerAddress = accounts[1];
    CONFIG.userAddress = accounts[2];
    console.log(CONFIG);

    Loyalty.setProvider(web3.currentProvider);
    Loyalty.deployed().then(function (instance) {
      instance.balanceOf.call(CONFIG.userAddress)
        .then((rs) => {
          updateBalance(rs.toString());
          console.log('update balance :' + rs.toString());
        });
    })
    displayQrCode(CONFIG.userAddress);
  });
});