const SHA256 = require("crypto-js/sha256");
class Block{
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
  }
}

class BlockChain{
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, '01/01/2018', 'Genesis block', '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
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
      return true;
    }
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
  myChain.addBlock(new Block(i, formatDate(new Date()), { amount: i*3 }))
}

console.log(myChain);