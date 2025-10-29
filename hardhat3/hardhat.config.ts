import { configVariable, task, type HardhatUserConfig } from "hardhat/config";
import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";

const getHDWallet = () => {
  const PRIVATE_KEY = configVariable("PRIVATE_KEY");
  if (PRIVATE_KEY) {
    return [PRIVATE_KEY]
  }
  throw Error("Private Key Not Set! Please set up .env");
}

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    development: {
      type: "http",
      url: "http://localhost:8545",
      accounts: getHDWallet(),
    },
    testnet: {
      chainId: 338,
      type: "http",
      url: "https://evm-t3.cronos.org/",
      accounts: getHDWallet(),
      chainType: "l1",
    },
    mainnet: {
      chainId: 25,
      type: "http",
      url: "https://evm.cronos.org/",
      accounts: getHDWallet(),
      chainType: "l1",
    }
  }
};

export default config;
