var Loyalty = artifacts.require('./Loyalty.sol');

contract('Loyalty', function (accounts) {
    it('Can add new retailer and issue token', function () {
        const retailer1 = accounts[1];
        const retailer2 = accounts[2];
        return Loyalty.deployed().then(function (instance) {
            // add new retailer and issue 1000000 tokens
            instance.addRetailer(retailer1, { from: accounts[0] })
                .then(() => {
                    return instance.balanceOf.call(retailer1)
                        .then((rs) => {
                            assert.equal(rs.toString(10), '1000000');
                            return instance.isAllowedRetailer.call(retailer1);
                        })
                        .then((rs) => {
                            assert.equal(rs, true);
                            // check not allow retailer
                            return instance.isAllowedRetailer.call(retailer2);
                        })
                        .then((rs) => {
                            assert.equal(rs, false);
                        })
                });
            
                // sender != owner khong the addRetailer
            instance.addRetailer(retailer2, { from: accounts[3] })
                .then(() => {
                    return instance.balanceOf.call(retailer2)
                        .then((rs) => {
                            assert.notEqual(rs.toString(10), '1000000');
                            // check not allow retailer
                            return instance.isAllowedRetailer.call(retailer2);
                        })
                        .then((rs) => {
                            assert.equal(rs, false);
                        })
                }, (e) => {
                    // assert exception
                    assert.match(e, /Error: VM Exception while processing transaction: revert/);
                })
        })
    });

});
