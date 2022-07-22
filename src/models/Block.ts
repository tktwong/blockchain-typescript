import * as CryptoJS from 'crypto-js'


class Block {
  readonly index: number
  readonly hash: string
  readonly previousHash: string
  readonly timestamp: number
  readonly data: string

  constructor(index: number, previousHash: string, timestamp: number, data: string) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.hash = this.calculateHash();
  }

  private calculateHash(): string {
    return CryptoJS.SHA256(this.index + this.previousHash + this.timestamp + this.data).toString();
  }
}

export {
  Block
}