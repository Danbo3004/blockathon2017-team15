// Import the page's CSS. Webpack will know what to do with it.
import "../css/app.css";
import "./auth.js";
import CONFIG from "./config.js";


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

window.createNewAccount = function () {
  var wallet = Wallet.generate();
  console.log('0x' + wallet.getPrivateKey().toString('hex'));
  console.log('0x' + wallet.getAddress().toString('hex'));
  $('#publicKey').val(wallet.getAddress().toString('hex'));
  $('#privateKey').val(wallet.getPrivateKey().toString('hex'));
 
  localStorage.setItem("publicKey", wallet.getAddress().toString('hex'));
  localStorage.setItem("privateKey", wallet.getPrivateKey().toString('hex'));
}

var updateBalance = function(balance) {
  $('#userBalance').text(balance);
  $('#userBalance').parent().removeClass('hide');
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
      console.log(txHash)
    })
  })
}

window.voteForCandidate = function (candidate) {
  // let candidateName = $("#candidate").val();
  // try {
  //   $("#msg").html("Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain. Please wait.")
  //   $("#candidate").val("");
  //   /* Voting.deployed() returns an instance of the contract. Every call
  //    * in Truffle returns a promise which is why we have used then()
  //    * everywhere we have a transaction call
  //    */
  //   Voting.deployed().then(function (contractInstance) {


  //     contractInstance.voteForCandidate(candidateName, { gas: 140000, from: web3.eth.accounts[0] }).then(function () {
  //       let div_id = candidates[candidateName];


  //       return contractInstance.totalVotesFor.call(candidateName).then(function (v) {
  //         $("#" + div_id).html(v.toString());
  //         $("#msg").html("");
  //       });
  //     });
  //   });
  // } catch (err) {
  //   console.log(err);
  // }
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

  

  Loyalty.setProvider(web3.currentProvider);
  Loyalty.deployed().then(function (instance) {
    instance.balanceOf.call(CONFIG.userAddress)
    .then((rs) => {
      console.log(rs);
      updateBalance(rs.toString());
    });
  //     var address = localStorage.getItem("publicKey");
  //       contractInstance.balanceOf.call(address).then(function (v) {
  //         console.log(v.toString());

  //       });
  })

  displayAddress(CONFIG.userAddress);

});