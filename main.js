const SHA256 = require("crypto-js/sha256");

class Transaction{
  constructor(fromAddress, toAddress, amount){
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block{
  constructor( timestamp, transactions, previousHash = '') {
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.hash = this.calculateHash();
    this.nounce = 0;
  }

  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nounce).toString();
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')){
      this.nounce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined: " + this.hash);
  }
}

class BlockChain{
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block('01/01/2018', [], '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress){
    let block = new Block(formatDate(new Date()), this.pendingTransactions, this.getLatestBlock().hash);
    block.mineBlock(this.difficulty);

    console.log('Block successfully mined!');
    this.chain.push(block);

    this.pendingTransactions = [ new Transaction(null, miningRewardAddress, this.miningReward)]
  }

  createTransaction(transaction){
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address){
    let balance = 0;

    for(const block of this.chain){
      for(const trans of block.transactions){
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;

  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++){
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()){
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash){
        return false;
      }      
    }
    return true;
  }
}

function formatDate(date) {

  day = date.getDate();
  if (day < 10 ) {
    day = '0' + day;
  }
  month = date.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  year = date.getFullYear();

  return day + '/' + month + '/' + year;
}


let myChain = new BlockChain();

for (let i = 1; i < 5; i++){
  let address1 = 'address' + i;
  let address2 = 'address' + ( i + 1 );
  myChain.createTransaction(new Transaction(address1, address2, 50*i));
}

console.log('\n Starting the miner...');
myChain.minePendingTransactions('address1');
for (let i = 1; i < 6; i++){
  let address = 'address' + i;
  console.log('\n Balance of', address, 'is', myChain.getBalanceOfAddress(address), '@$');
}

console.log(myChain);

console.log('\n Starting the miner again...');
myChain.minePendingTransactions('address1');
for (let i = 1; i < 6; i++){
  let address = 'address' + i;
  console.log('\n Balance of', address, ' is ', myChain.getBalanceOfAddress(address), '@$');
}
console.log(myChain);

