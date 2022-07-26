import * as CryptoJS from 'crypto-js'


class Block {
  readonly index: number
  readonly hash: string
  readonly previousHash: string
  readonly timestamp: number
  readonly data: string

  constructor(index: number, hash: string, previousHash: string, timestamp: number, data: string) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
  }

  public isDeeperThan(block: Block) {
    return this.index > block.index
  }
}

export {
  Block
}