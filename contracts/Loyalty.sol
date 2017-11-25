pragma solidity ^0.4.17;

contract Loyalty {

    uint256 public totalSupply;
    uint256 initialToken = 1000000;
    address owner;
    mapping (address => uint256) balances;
    mapping (address => bool) retailers;

    struct Retailer {
        address retailerAddress;
    }

    function Loyalty() public {
        // xac dinh owner
        owner = msg.sender;
    }
    event Transfer(address indexed _from, address indexed _to, uint256 _amount);

    // check owner permission
    modifier onlyOwner(address _addr) {
        require(_addr == owner);
        _;
    }

    // check owner permission
    modifier onlyRetailer(address _addr) {
        require(retailers[_addr] = true);
        _;
    }

    function addRetailer(address _retailerAddress) onlyOwner(msg.sender) public returns (bool) {
        //_retailerAddress ko hop le hoac _retailerAddress trung voi owner address
        if (_retailerAddress == address(0) || _retailerAddress == owner) {
            return false;
        }
        // add retailer to white list
        retailers[_retailerAddress] = true;
        // issue token to retailer for them to give back to user
        balances[_retailerAddress] = safeAdd(balances[_retailerAddress], initialToken);
        totalSupply = safeAdd(totalSupply, initialToken); initialToken;
        
        return true;
    }

    function rewardToken(address _addr, uint256 _numToken) onlyRetailer(msg.sender) public returns (bool) {
        // check tai khoan gui co trong danh sach allowed chua
        // check balance cua tai khoan gui
        if (balances[msg.sender] < _numToken) {
            return false;
        }
        // tru token trong tai khoan retailer
        balances[msg.sender] = safeSub(balances[msg.sender], _numToken);
        // cong token cho user
        balances[_addr] = safeAdd(balances[_addr], _numToken);
        // luu thong tin mua hang - user address (optional)
        
        return true;
    }
    
    /**
    * Supply them token cho retailer de dam bao retailer ko bi run out of token
     */
    function supplyToken(address _retailerAddress, uint256 _numToken) onlyOwner(msg.sender) onlyRetailer(_retailerAddress) public returns (bool) {
        // cong token cho _retailerAddress
        balances[_retailerAddress] = safeAdd(balances[_retailerAddress], _numToken);
        // tang totalSupply
        totalSupply = safeAdd(totalSupply, _numToken);

        return true;
    }

    //Redeem with token
    function redeemToken(address _retailerAddress, uint256 _numToken) onlyRetailer(_retailerAddress) public returns(bool) {
        address user = msg.sender;
        if (balances[user] < _numToken) {
            return false;
        } 

        balances[user] = safeSub(balances[user], _numToken);
        balances[_retailerAddress] = safeAdd(balances[_retailerAddress], _numToken);
        // TODO: store info about this redeem 

        return true;
    }

    // Constant function that return token balance of an address
    function balanceOf(address _addr) public constant returns (uint256) {
        return balances[_addr];
    }

    function isAllowedRetailer(address _addr) public constant returns (bool) {
        return retailers[_addr];
    }

    /**
        @dev returns the sum of _x and _y, asserts if the calculation overflows

        @param _x   value 1
        @param _y   value 2

        @return sum
    */
    function safeAdd(uint256 _x, uint256 _y) internal pure returns (uint256) {
        uint256 z = _x + _y;
        assert(z >= _x);
        return z;
    }

    /**
        @dev returns the difference of _x minus _y, asserts if the subtraction results in a negative number

        @param _x   minuend
        @param _y   subtrahend

        @return difference
    */
    function safeSub(uint256 _x, uint256 _y) internal pure returns (uint256) {
        assert(_x >= _y);
        return _x - _y;
    }
}