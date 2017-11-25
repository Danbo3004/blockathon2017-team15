// Import the page's CSS. Webpack will know what to do with it.
import "../css/app.css";
import "./auth.js";
window.CONFIG = {};
// Import libraries we need.
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract'
// var Wallet = require('ethereumjs-wallet');
import Wallet from 'ethereumjs-wallet'
const EthereumTx = require('ethereumjs-tx')
import Tx from 'ethereumjs-tx'
import QR from 'qr-image'

import loyalty_artifacts from '../../build/contracts/Loyalty.json'
var Loyalty = contract(loyalty_artifacts);

window.displayAddress = function (text) {
  var svg_string = QR.imageSync(text, { type: 'svg' });
  $('#address_image').html(svg_string);
  $('#address').html(text);
}

var updateBalance = function (balance) {
  $('#userBalance').text(balance);
  $('#userBalance').parent().removeClass('hide');
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

window.getBalance = function (address) {
  //web3.eth.accounts[0]
  web3.eth.getBalance(address, (error, balance) => {
    console.log(web3.fromWei(balance.toString(10)));
  });
}


window.sendTransaction = function (from, to, value) {
  let transactionObj = {
    from: from,
    to: to,
    value: web3.toWei(value, 'ether')
  };
  web3.eth.sendTransaction(transactionObj, (error, txHash) => {
    console.log(error);
    console.log(txHash);
  });

}

window.sendRawTransaction = function (_from, privateKey, _to, value) {

  web3.eth.getTransactionCount(_from, (error, txCount) => {
    //txCount = txCount +1;
    console.log('txcount:' + txCount);
    let privKey = new Buffer(privateKey, 'hex')
    let rawTransactionObj = {
      nonce: web3.toHex(txCount),
      to: _to,
      value: web3.toHex(web3.toWei(value, 'ether')),
      gasPrice: web3.toHex(21000),
      gasLimit: web3.toHex(300000),
    }
    let tx = new Tx(rawTransactionObj);
    tx.sign(privKey)
    let serializeTx = '0x' + tx.serialize().toString('hex')
    web3.eth.sendRawTransaction(serializeTx, (error, txHash) => {
      console.log("transaction hash -> :");
      console.log(txHash);
      console.log("transaction error -> :");
      console.log(error);
    })
  })
}

window.rewardToken = function () {
  try {
    Loyalty.deployed().then(function (instance) {
      instance.rewardToken(CONFIG.userAddress, 40, {from: CONFIG.retailerAddress }).then(function (rs) {
        console.log('callbackReward');
        console.log(rs);
      });
    });
  } catch (err) {
    console.log(err);
  }
}

window.addRetailer = function () {
  try {
    Loyalty.deployed().then(function (instance) {
      //  /web3.personal.unlockAccount(CONFIG.retailerAddress, CONFIG.cashierPrivateKey,1500);
      instance.addRetailer(CONFIG.retailerAddress,{ gas: 140000, from: CONFIG.ownerAddress}).then(function (rs) {
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
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
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

    displayAddress(CONFIG.userAddress);
  });

});