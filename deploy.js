require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require("web3");
const { abi, evm } = require("./compile");

const mnemonic = process.env.MNEMONIC;
const infuraEndpoint = process.env.SEPOLIA_INFURA_ENDPOINT;

const provider = new HDWalletProvider(mnemonic, infuraEndpoint);
const web3 = new Web3(provider);

const initialMsg = "hey";

const processDeployment = async () => {
  const accounts = await web3.eth.getAccounts();

  /* To check the balance
   *
   * const balance = await web3.eth.getBalance(accounts[0]);
   * console.log(accounts, balance);
   */

  const inbox = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
      arguments: [initialMsg],
    })
    .send({
      from: accounts[0],
      gas: 1000000,
    });

  console.log(inbox, inbox.options.address);
  /* 
  Call provider.engine.stop() to prevent deployment from hanging in the terminal - Source
  */
  provider.engine.stop();
};

processDeployment();

/* 
deployed address: 0x236FA564bf9baF1b518D1B44618cd88c345CDdd3
*/
