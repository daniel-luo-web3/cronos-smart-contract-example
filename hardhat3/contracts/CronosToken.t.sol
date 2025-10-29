// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "./CronosToken.sol";

contract CronosTokenTest is Test {
    CronosToken token;
    address owner;
    address alice;
    address bob;

    uint256 initialSupply = 1_000_000 ether;

    function setUp() public {
        owner = address(this);
        alice = makeAddr("alice");
        bob = makeAddr("bob");

        // deploy contract
        token = new CronosToken("Cronos Token", "CT", initialSupply);
    }

    /// @notice verify initial supply is correct
    function testInitialSupply() public {
        assertEq(token.totalSupply(), initialSupply);
        assertEq(token.balanceOf(owner), initialSupply);
        assertEq(token.name(), "Cronos Token");
        assertEq(token.symbol(), "CT");
    }

    /// @notice test normal transfer
    function testTransfer() public {
        uint256 amount = 100 ether;

        token.transfer(alice, amount);

        assertEq(token.balanceOf(alice), amount);
        assertEq(token.balanceOf(owner), initialSupply - amount);
    }

    /// @notice test transfer revert in case of insufficient balance
    function testTransferRevert_InsufficientBalance() public {
        vm.prank(alice); // 让 alice 发起交易（当前余额=0）
        vm.expectRevert(); // ERC20 标准会 revert
        token.transfer(bob, 1 ether);
    }

    /// @notice test approve / transferFrom
    function testApproveAndTransferFrom() public {
        uint256 amount = 50 ether;

        // owner 授权 alice
        token.approve(alice, amount);
        assertEq(token.allowance(owner, alice), amount);

        // alice 调用 transferFrom 把 owner 的币转给自己
        vm.prank(alice);
        token.transferFrom(owner, alice, amount);

        assertEq(token.balanceOf(alice), amount);
        assertEq(token.balanceOf(owner), initialSupply - amount);
    }

    /// @notice test allowance decreases after transferFrom
    function testAllowanceDecreasesAfterTransferFrom() public {
        uint256 amount = 20 ether;
        token.approve(alice, amount);

        vm.prank(alice);
        token.transferFrom(owner, alice, 10 ether);

        assertEq(token.allowance(owner, alice), 10 ether);
    }
}
