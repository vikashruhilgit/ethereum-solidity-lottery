const ganache = require("ganache");
const { Web3 } = require("web3");

const { abi, evm } = require("../compile");

const web3 = new Web3(ganache.provider());

let accounts;
let lottery;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
    })
    .send({
      from: accounts[0],
      gas: "1000000",
    });
});

describe("Lottery contracts", () => {
  it("Contract deployed", () => {
    expect(lottery.options.address).toBeTruthy();
  });

  it("has owner", async () => {
    const owner = await lottery.methods.owner().call();
    expect(owner).toBe(accounts[0]);
  });

  it("register", async () => {
    await lottery.methods.register().send({
      from: accounts[0],
      value: web3.utils.toWei("0.001", "ether"),
    });

    const players = await lottery.methods.getPlayers().call();

    expect(players).toHaveLength(1);
    expect(players).toContain(accounts[0]);
  });

  it("register multiple players", async () => {
    await lottery.methods.register().send({
      from: accounts[0],
      value: web3.utils.toWei("0.001", "ether"),
    });
    await lottery.methods.register().send({
      from: accounts[1],
      value: web3.utils.toWei("0.001", "ether"),
    });
    await lottery.methods.register().send({
      from: accounts[2],
      value: web3.utils.toWei("0.001", "ether"),
    });

    const players = await lottery.methods.getPlayers().call({});

    expect(players).toHaveLength(3);
    expect(players).toContain(accounts[0]);
    expect(players).toContain(accounts[1]);
    expect(players).toContain(accounts[2]);
  });

  it("fails to register with-out ether", async () => {
    try {
      const result = await lottery.methods.register().send({
        from: accounts[0],
        value: 1,
      });
      expect(result).toBeFalsy();
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });

  it("should have a winner", async () => {
    await lottery.methods.register().send({
      from: accounts[0],
      value: web3.utils.toWei("5", "ether"),
    });

    const beforeBalance = await web3.eth.getBalance(accounts[0]);
    const winner = await lottery.methods.winner().send({
      from: accounts[0],
    });
    const afterBalance = await web3.eth.getBalance(accounts[0]);

    const diff =
      web3.utils.fromWei(afterBalance, "ether") -
      web3.utils.fromWei(beforeBalance, "ether");
    expect(diff).toBeGreaterThan(4.8);
  });

  it("non other then owner should call the winner", async () => {
    await lottery.methods.register().send({
      from: accounts[0],
      value: web3.utils.toWei("0.001", "ether"),
    });
    await lottery.methods.register().send({
      from: accounts[1],
      value: web3.utils.toWei("0.001", "ether"),
    });
    await lottery.methods.register().send({
      from: accounts[2],
      value: web3.utils.toWei("0.001", "ether"),
    });

    try {
      const winner = await lottery.methods.winner().send({
        from: accounts[1],
      });
      expect(winner).toBeFalsy();
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });

  // this is a private function
  /* it("genrate rendom no", async () => {
    const maxLength = 5;
    const rendomNo = await lottery.methods.rendom(maxLength).call();

    expect(rendomNo).toBeLessThan(maxLength);
    expect(rendomNo).toBeGreaterThan(0);
  }); */
});
