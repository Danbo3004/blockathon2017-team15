pragma solidity ^0.4.17;

contract Loyalty {

    uint256 public totalSupply;
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

    function addRetailer(address _retailerAddress) onlyOwner(msg.sender) public {
        //_retailerAddress ko hop le
        if (_retailerAddress == address(0)) {
            return;
        }
        // add retailer to white list
        retailers[_retailerAddress] = true;
        // issue token to retailer for them to give back to user
        uint256 initialToken = 1000000;
        balances[_retailerAddress] += initialToken;
        totalSupply += initialToken;
    }

    function rewardToken(address _addr, uint8 _numToken) onlyRetailer(msg.sender) payable public {
        // check tai khoan gui co trong danh sach allowed chua
        // check balance cua tai khoan gui
        if (balances[msg.sender] < _numToken) {
            return;
        }
        // tru token trong tai khoan retailer
        balances[msg.sender] -= _numToken;
        // cong token cho user
        balances[_addr] += _numToken;
        // luu thong tin mua hang - user address
        
        // Emit event
        // Transfer(0x0, msg.sender, amount);
    }

    // Constant function that return token balance of an address
    function balanceOf(address _addr) public constant returns (uint256) {
        return balances[_addr];
    }

    function isAllowedRetailer(address _addr) public constant returns (bool) {
        return retailers[_addr];
    }
}