var Loyalty = artifacts.require("./Loyalty.sol");

module.exports = function (deployer) {
    deployer.deploy(Loyalty);
};
