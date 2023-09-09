const ganache = require("ganache");
const { Web3 } = require("web3");
const assert = require("assert");

const { abi, evm } = require("../compile");

const web3 = new Web3(ganache.provider());

let accounts;
let inbox;

const initialMsg = "hi";

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  inbox = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
      arguments: [initialMsg],
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox contracts", () => {
  it("Contract deployed", () => {
    assert.ok(inbox.options.address);
  });

  it("Contract has initial msg", async () => {
    const msg = await inbox.methods.message().call();
    assert.equal(msg, initialMsg);
  });

  it("Contract getMessage return initial msg", async () => {
    const msg = await inbox.methods.getMessage().call();
    assert.equal(msg, initialMsg);
  });

  it("Contract setMessage update msg", async () => {
    const newMsg = "bye";
    await inbox.methods.setMessage(newMsg).send({
      from: accounts[0],
    });

    const msg = await inbox.methods.getMessage().call();
    assert.equal(msg, newMsg);
  });
});
