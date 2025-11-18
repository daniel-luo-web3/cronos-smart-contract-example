import { ethers } from "ethers";

const abiCoder = new ethers.AbiCoder();
const encoded = abiCoder.encode(["string", "string", "uint256"], ["Cronos Token", "CRT", "1000000000000000000000000"]);
console.log(encoded);