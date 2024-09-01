// SPDX-License-Identifier: GPL-2.0-only
pragma solidity >=0.8.19;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Rewards} from "./Rewards.sol";
import {BaseERC20} from "./BaseERC20.sol";

error DeadlineExpired();
error PortalNotActive();
error PortalAlreadyActive();
error AccountDoesNotExist();
error InsufficientToWithdraw();
error InsufficientStake();
error InsufficientPEtokens();
error InsufficientBalance();
error InvalidOutput();
error InvalidInput();
error InvalidToken();
error FundingPhaseOngoing();
error DurationLocked();
error DurationCannotIncrease();



contract AlphaCore is ReentrancyGuard {
    constructor(uint256 _FUNDING_EXCHANGE_RATIO,
        uint256 _FUNDING_REWARD_RATE, 
        address _PRINCIPAL_TOKEN_ADDRESS,
        address _ALPHA_ADDRESS,
        address _REWARDS_CONTRACT,
        address _CONTRIBUTOR_TOKEN,
        address _PORTAL_ENERGY,
        uint256 _TERMINAL_MAX_LOCK_DURATION, 
        uint256 _AMOUNT_TO_CONVERT)
        {
            if (_FUNDING_EXCHANGE_RATIO == 0) {revert InvalidInput();}
            if (_FUNDING_REWARD_RATE == 0) {revert InvalidInput();}
            if (_PRINCIPAL_TOKEN_ADDRESS == address(0)) {revert InvalidInput();}
            if (_ALPHA_ADDRESS == address(0)) {revert InvalidInput();}
            if (_CONTRIBUTOR_TOKEN == address(0)) {revert InvalidInput();}
            if (_PORTAL_ENERGY == address(0)) {revert InvalidInput();}
            if (_TERMINAL_MAX_LOCK_DURATION < maxLockDuration) {revert InvalidInput();}
            if (_AMOUNT_TO_CONVERT == 0) {revert InvalidInput();}

            REWARDS_CONTRACT = _REWARDS_CONTRACT;
            FUNDING_EXCHANGE_RATIO = _FUNDING_EXCHANGE_RATIO;
            FUNDING_REWARD_RATE = _FUNDING_REWARD_RATE;
            PRINCIPAL_TOKEN_ADDRESS = _PRINCIPAL_TOKEN_ADDRESS;
            ALPHA_ADDRESS = _ALPHA_ADDRESS;
            contributorToken = BaseERC20(_CONTRIBUTOR_TOKEN);
            portalEnergyToken = BaseERC20(_PORTAL_ENERGY);
            TERMINAL_MAX_LOCK_DURATION = _TERMINAL_MAX_LOCK_DURATION;
            maxLockDuration = _TERMINAL_MAX_LOCK_DURATION;
            AMOUNT_TO_CONVERT = _AMOUNT_TO_CONVERT;
            CREATION_TIME = block.timestamp;
            owner = msg.sender;
    }

    using SafeERC20 for IERC20;

    BaseERC20 contributorToken;
    BaseERC20 portalEnergyToken;

    address public owner;

    address immutable public ALPHA_ADDRESS;
    uint256 immutable public AMOUNT_TO_CONVERT;
    uint256 immutable public TERMINAL_MAX_LOCK_DURATION;
    uint256 immutable public CREATION_TIME;
    uint256 constant private SECONDS_PER_YEAR = 31536000;
    uint256 public maxLockDuration = 7776000;
    uint256 public totalPrincipalStaked;
    bool private lockDurationUpdateable = true;

    address immutable public REWARDS_CONTRACT;
    address immutable public PRINCIPAL_TOKEN_ADDRESS;
    uint256 immutable public FUNDING_REWARD_RATE;
    uint256 immutable private FUNDING_EXCHANGE_RATIO;
    uint256 constant public FUNDING_REWARD_SHARE = 10;
    uint256 public fundingBalance;
    uint256 public fundingRewardPool;
    uint256 public fundingRewardsCollected;
    uint256 public fundingMaxRewards;
    bool public isActivePortal;

    uint256 public constantProduct;

    struct Account {
        bool isExist;
        uint256 lastUpdateTime;
        uint256 lastMaxLockDuration;
        uint256 stakedBalance;
        uint256 maxStakeDebt;
        uint256 portalEnergy;
        uint256 availableToWithdraw;
    }
    mapping(address => Account) public accounts;

    event PortalActivated(address indexed, uint256 fundingBalance);
    event FundingReceived(address indexed, uint256 amount);
    event RewardsRedeemed(address indexed, uint256 amountBurned, uint256 amountReceived);

    event PortalEnergyBuyExecuted(address indexed, uint256 amount);
    event PortalEnergySellExecuted(address indexed, uint256 amount);

    event PortalEnergyMinted(address indexed, address recipient, uint256 amount);
    event PortalEnergyBurned(address indexed, address recipient, uint256 amount);

    event TokenStaked(address indexed user, uint256 amountStaked);
    event TokenUnstaked(address indexed user, uint256 amountUnstaked);
    event RewardsClaimed(address[] indexed pools, address[][] rewarders, uint256 timeStamp);

    event StakePositionUpdated(address indexed user, 
        uint256 lastUpdateTime,
        uint256 lastMaxLockDuration,
        uint256 stakedBalance,
        uint256 maxStakeDebt,
        uint256 portalEnergy,
        uint256 availableToWithdraw);

    modifier activePortalCheck() {
        if (!isActivePortal) {
            revert PortalNotActive();
        }
        _;
    }

    modifier nonActivePortalCheck() {
        if (isActivePortal) {
        revert PortalAlreadyActive();
        }
        _;
    }

    modifier existingAccount() {
        if (!accounts[msg.sender].isExist) {
            revert AccountDoesNotExist();
        }
        _;
    }

    function _updateAccount(address _user, uint256 _amount) private {
        uint256 portalEnergyEarned = (accounts[_user].stakedBalance * 
            (block.timestamp - accounts[_user].lastUpdateTime)) / SECONDS_PER_YEAR;

        accounts[_user].lastUpdateTime = block.timestamp;

        accounts[_user].stakedBalance += _amount;

        accounts[_user].portalEnergy += portalEnergyEarned;

        if (accounts[_user].portalEnergy >= accounts[_user].maxStakeDebt) {
            accounts[_user].availableToWithdraw = accounts[_user].stakedBalance;
        } else {
            accounts[_user].availableToWithdraw = (accounts[_user].stakedBalance * accounts[_user].portalEnergy) / accounts[_user].maxStakeDebt;
        }
    }


    function stake(uint256 _amount) external nonReentrant activePortalCheck {
        if (_amount == 0) {revert InvalidInput();}

        if(accounts[msg.sender].isExist == true){
            _updateAccount(msg.sender, _amount);
        } 
        else {
            uint256 maxStakeDebt = (_amount * maxLockDuration) / SECONDS_PER_YEAR;
            uint256 availableToWithdraw = _amount;
            uint256 portalEnergy = maxStakeDebt;
            
            accounts[msg.sender] = Account(true, 
                block.timestamp,
                maxLockDuration, 
                _amount, 
                maxStakeDebt, 
                portalEnergy,
                availableToWithdraw);     
        }

        totalPrincipalStaked += _amount;

        IERC20(PRINCIPAL_TOKEN_ADDRESS).safeTransferFrom(msg.sender, address(this), _amount);

        _depositToYieldSource();

        emit StakePositionUpdated(msg.sender, 
        block.timestamp,
        maxLockDuration,
        accounts[msg.sender].stakedBalance,
        accounts[msg.sender].maxStakeDebt, 
        accounts[msg.sender].portalEnergy, 
        accounts[msg.sender].availableToWithdraw);
    }


    function unstake(uint256 _amount) external nonReentrant existingAccount {
        _updateAccount(msg.sender,0);

        if(_amount > accounts[msg.sender].availableToWithdraw) {revert InsufficientToWithdraw();}
        if(_amount > accounts[msg.sender].stakedBalance) {revert InsufficientStake();}

        _withdrawFromYieldSource(_amount);

        uint256 stakedBalance = accounts[msg.sender].stakedBalance -= _amount;
        uint256 maxStakeDebt = accounts[msg.sender].maxStakeDebt -= (_amount * maxLockDuration) / SECONDS_PER_YEAR;
        uint256 portalEnergy = accounts[msg.sender].portalEnergy -= (_amount * maxLockDuration) / SECONDS_PER_YEAR;
        uint256 availableToWithdraw = accounts[msg.sender].availableToWithdraw -= _amount;

        totalPrincipalStaked -= _amount;

        IERC20(PRINCIPAL_TOKEN_ADDRESS).safeTransfer(msg.sender, _amount);

        emit StakePositionUpdated(msg.sender, 
        block.timestamp,
        maxLockDuration,
        stakedBalance,
        maxStakeDebt, 
        portalEnergy,
        availableToWithdraw);
    }


    function forceUnstakeAll() external nonReentrant existingAccount {
        _updateAccount(msg.sender,0);

        uint256 portalEnergy = accounts[msg.sender].portalEnergy;

        if(portalEnergy < accounts[msg.sender].maxStakeDebt) {

            uint256 remainingDebt = accounts[msg.sender].maxStakeDebt - portalEnergy;

            if(IERC20(portalEnergyToken).balanceOf(address(msg.sender)) < remainingDebt) {revert InsufficientPEtokens();}
            
            _burnPortalEnergyToken(msg.sender, remainingDebt);
        }

        uint256 balance = accounts[msg.sender].stakedBalance;
        _withdrawFromYieldSource(balance);

        accounts[msg.sender].stakedBalance = 0;
        accounts[msg.sender].maxStakeDebt = 0;
        portalEnergy = accounts[msg.sender].portalEnergy -= (balance * maxLockDuration) / SECONDS_PER_YEAR;
        accounts[msg.sender].availableToWithdraw = 0;

        IERC20(PRINCIPAL_TOKEN_ADDRESS).safeTransfer(msg.sender, balance);
        
        totalPrincipalStaked -= balance;

        emit StakePositionUpdated(msg.sender, 
        block.timestamp,
        maxLockDuration,
        0,
        0, 
        portalEnergy,
        0);
    }

    function _depositToYieldSource() private {
        uint256 balance = IERC20(PRINCIPAL_TOKEN_ADDRESS).balanceOf(address(this));
        IERC20(PRINCIPAL_TOKEN_ADDRESS).approve(REWARDS_CONTRACT, balance);

        Rewards(REWARDS_CONTRACT).stakeToken(PRINCIPAL_TOKEN_ADDRESS, balance);

        emit TokenStaked(msg.sender, balance);
    }


    function _withdrawFromYieldSource(uint256 _amount) private {

        Rewards(REWARDS_CONTRACT).unStakeToken(PRINCIPAL_TOKEN_ADDRESS, _amount);

        emit TokenUnstaked(msg.sender, _amount);
    }


    function claimRewards() internal {
        Rewards(REWARDS_CONTRACT).claimRewards(PRINCIPAL_TOKEN_ADDRESS, address(this));
    }

    function buyPortalEnergy(uint256 _amountInput, uint256 _minReceived, uint256 _deadline) external nonReentrant existingAccount {
        if (_amountInput == 0) {revert InvalidInput();}
        
        if (_deadline < block.timestamp) {revert DeadlineExpired();}

        if(IERC20(ALPHA_ADDRESS).balanceOf(msg.sender) < _amountInput) {revert InsufficientBalance();}
        
        uint256 reserve0 = IERC20(ALPHA_ADDRESS).balanceOf(address(this)) - fundingRewardPool;

        uint256 reserve1 = constantProduct / reserve0;

        uint256 amountReceived = (_amountInput * reserve1) / (_amountInput + reserve0);

        if(amountReceived < _minReceived) {revert InvalidOutput();}

        _updateAccount(msg.sender,0);

        accounts[msg.sender].portalEnergy += amountReceived;

        IERC20(ALPHA_ADDRESS).safeTransferFrom(msg.sender, address(this), _amountInput);

        emit PortalEnergyBuyExecuted(msg.sender, amountReceived);
    }


    function sellPortalEnergy(uint256 _amountInput, uint256 _minReceived, uint256 _deadline) external nonReentrant existingAccount {
        if (_amountInput == 0) {revert InvalidInput();}        
        
        if (_deadline < block.timestamp) {revert DeadlineExpired();}

        _updateAccount(msg.sender,0);
        
        if(accounts[msg.sender].portalEnergy < _amountInput) {revert InsufficientBalance();}

        uint256 reserve0 = IERC20(ALPHA_ADDRESS).balanceOf(address(this)) - fundingRewardPool;

        uint256 reserve1 = constantProduct / reserve0;

        uint256 amountReceived = (_amountInput * reserve0) / (_amountInput + reserve1);

        if(amountReceived < _minReceived) {revert InvalidOutput();}

        accounts[msg.sender].portalEnergy -= _amountInput;

        IERC20(ALPHA_ADDRESS).safeTransfer(msg.sender, amountReceived);

        emit PortalEnergySellExecuted(msg.sender, _amountInput);
    }


    function quoteBuyPortalEnergy(uint256 _amountInput) external view returns(uint256) { 
        uint256 reserve0 = IERC20(ALPHA_ADDRESS).balanceOf(address(this)) - fundingRewardPool;

        uint256 reserve1 = constantProduct / reserve0;

        uint256 amountReceived = (_amountInput * reserve1) / (_amountInput + reserve0);

        return (amountReceived);
    }


    function quoteSellPortalEnergy(uint256 _amountInput) external view returns(uint256) {
        uint256 reserve0 = IERC20(ALPHA_ADDRESS).balanceOf(address(this)) - fundingRewardPool;

        uint256 reserve1 = constantProduct / reserve0;

        uint256 amountReceived = (_amountInput * reserve0) / (_amountInput + reserve1);

        return (amountReceived);
    }

    function convert() external nonReentrant {
        claimRewards();

        uint256 contractBalance = IERC20(REWARDS_CONTRACT).balanceOf(address(this));
        if(contractBalance == 0)  {revert InvalidOutput();}

        IERC20(ALPHA_ADDRESS).safeTransferFrom(msg.sender, address(this), AMOUNT_TO_CONVERT); 

        if (contributorToken.totalSupply() > 0 && fundingRewardsCollected < fundingMaxRewards) {
            uint256 newRewards = (FUNDING_REWARD_SHARE * AMOUNT_TO_CONVERT) / 100;
            fundingRewardPool += newRewards;
            fundingRewardsCollected += newRewards;
        }

        IERC20(REWARDS_CONTRACT).safeTransfer(msg.sender, contractBalance);
    }

    function contributeFunding(uint256 _amount) external nonReentrant nonActivePortalCheck {
        if(_amount == 0) {revert InvalidInput();}

        uint256 mintableAmount = _amount * FUNDING_REWARD_RATE;

        fundingBalance += _amount;

        IERC20(ALPHA_ADDRESS).safeTransferFrom(msg.sender, address(this), _amount); 

        contributorToken.mint(msg.sender, mintableAmount);

        emit FundingReceived(msg.sender, mintableAmount);
    }


    function getBurnValuePSM(uint256 _amount) public view returns(uint256 burnValue) {
        burnValue = (fundingRewardPool * _amount) / contributorToken.totalSupply();
    }


    function burnContributorTokens(uint256 _amount) external nonReentrant activePortalCheck {
        if(_amount == 0) {revert InvalidInput();}

        uint256 amountToReceive = getBurnValuePSM(_amount);

        contributorToken.burnFrom(msg.sender, _amount);

        fundingRewardPool -= amountToReceive;

        IERC20(ALPHA_ADDRESS).safeTransfer(msg.sender, amountToReceive);

        emit RewardsRedeemed(address(msg.sender), _amount, amountToReceive);
    }


    function activatePortal() external nonActivePortalCheck {
        require(msg.sender == owner, "");
        
        uint256 requiredPortalEnergyLiquidity = fundingBalance * FUNDING_EXCHANGE_RATIO;
        
        constantProduct = fundingBalance * requiredPortalEnergyLiquidity;

        fundingMaxRewards = contributorToken.totalSupply();

        isActivePortal = true;

        emit PortalActivated(address(this), fundingBalance);
    }

    function mintPortalEnergyToken(address _recipient, uint256 _amount) external nonReentrant {   
        if (_amount == 0) {revert InvalidInput();}  

        if (_recipient == address(0)) {revert InvalidInput();}
        
        (, , , , , uint256 portalEnergy,) = getUpdateAccount(msg.sender,0);

        if(portalEnergy < _amount) {revert InsufficientBalance();}

        _updateAccount(msg.sender,0);

        accounts[msg.sender].portalEnergy -= _amount;

        portalEnergyToken.mint(_recipient, _amount);

        emit PortalEnergyMinted(address(msg.sender), _recipient, _amount);
    }


    function burnPortalEnergyToken(address _recipient, uint256 _amount) external nonReentrant {   
        if (_amount == 0) {revert InvalidInput();}  
        
        if(accounts[_recipient].isExist == false) {revert AccountDoesNotExist();}

        if(portalEnergyToken.balanceOf(address(msg.sender)) < _amount) {revert InsufficientBalance();}

        _updateAccount(_recipient,0);

        accounts[_recipient].portalEnergy += _amount;

        portalEnergyToken.burnFrom(msg.sender, _amount);

        emit PortalEnergyBurned(address(msg.sender), _recipient, _amount);
    }


    function _burnPortalEnergyToken(address _user, uint256 _amount) private {   

        portalEnergyToken.burnFrom(_user, _amount);

        accounts[_user].portalEnergy += _amount;
    }

    function getUpdateAccount(address _user, uint256 _amount) public view returns(
        address user,
        uint256 lastUpdateTime,
        uint256 lastMaxLockDuration,
        uint256 stakedBalance,
        uint256 maxStakeDebt,
        uint256 portalEnergy,
        uint256 availableToWithdraw) {

        uint256 portalEnergyEarned = (accounts[_user].stakedBalance * 
            (block.timestamp - accounts[_user].lastUpdateTime)) / SECONDS_PER_YEAR;
      
        uint256 portalEnergyIncrease = (accounts[_user].stakedBalance * (maxLockDuration - 
            accounts[_user].lastMaxLockDuration) + (_amount * maxLockDuration)) / SECONDS_PER_YEAR;

        lastUpdateTime = block.timestamp;

        lastMaxLockDuration = accounts[_user].lastMaxLockDuration;

        stakedBalance = accounts[_user].stakedBalance + _amount;

        maxStakeDebt = accounts[_user].maxStakeDebt + (_amount * maxLockDuration) / SECONDS_PER_YEAR;

        portalEnergy = accounts[_user].portalEnergy + portalEnergyEarned + portalEnergyIncrease;

        if (portalEnergy >= maxStakeDebt) {
            availableToWithdraw = stakedBalance;
        } else {
            availableToWithdraw = (stakedBalance * portalEnergy) / maxStakeDebt;
        }

        user = _user;
    }


    function quoteforceUnstakeAll(address _user) external view returns(uint256 portalEnergyTokenToBurn) {

        (, , , , uint256 maxStakeDebt, uint256 portalEnergy,) = getUpdateAccount(_user,0);

        if(maxStakeDebt > portalEnergy) {
            portalEnergyTokenToBurn = maxStakeDebt - portalEnergy;
        }
    }


    function getBalanceOfToken(address _token) external view returns (uint256) {
        return IERC20(_token).balanceOf(address(this));
    }


    function getPendingRewards() external view returns(uint256 claimableReward){
        claimableReward = Rewards(REWARDS_CONTRACT).pendingReward(PRINCIPAL_TOKEN_ADDRESS);
    }
}