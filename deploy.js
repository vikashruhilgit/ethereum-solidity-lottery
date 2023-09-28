require("dotenv").config();

const fs = require("fs");
const path = require("path");

const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require("web3");

const mnemonicPhrase = process.env.MNEMONIC;
const providerOrUrl = process.env.SEPOLIA_INFURA_ENDPOINT;

const provider = new HDWalletProvider({
  mnemonic: {
    phrase: mnemonicPhrase,
  },
  providerOrUrl,
});
const web3 = new Web3(provider);

// Read the bytecode from the file system
const bytecodePath = path.join(__dirname, "data", "LotteryBytecode.bin");
const bytecode = fs.readFileSync(bytecodePath, "utf8");

// Create a new contract object using the ABI and bytecode
const abi = require("./data/LotteryAbi.json");
const Lottery = new web3.eth.Contract(abi);

const processDeployment = async () => {
  const providersAccounts = await web3.eth.getAccounts();
  const defaultAccount = providersAccounts[0];

  /* To check the balance
   *
   * const balance = await web3.eth.getBalance(accounts[0]);
   * console.log(accounts, balance);
   */

  const lottery = Lottery.deploy({
    data: bytecode,
  });

  // optionally, estimate the gas that will be used for development and log it
  const gas = await lottery.estimateGas({
    from: defaultAccount,
  });

  try {
    // Deploy the contract to the Ganache network
    const tx = await lottery.send({
      from: defaultAccount,
      gas,
    });
    console.log(web3.utils.toHex(bytecode));
    console.log("Contract deployed at address: " + tx.options.address);
    // Write the Contract address to a new file
    const deployedAddressPath = path.join(
      __dirname,
      "data",
      "LotteryAddress.bin"
    );
    fs.writeFileSync(deployedAddressPath, tx.options.address);
  } catch (error) {
    console.error(error);
  }
  provider.engine.stop();
  /* 
  Call provider.engine.stop() to prevent deployment from hanging in the terminal - Source
  */
};

processDeployment();

/* 
deployed address: 0xb2b96db1ebb93aF73cf9bA27E211632BD29cEd40
on sepolia network.
*/
