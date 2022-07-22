import {Block} from './Block'

class Blockchain {
  private static genesisBlock: Block = new Block(
    0, '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', 1465154705, 'my genesis block!!'
  )
  private blockchain: Block[] = [Blockchain.genesisBlock]

  public generateNextBlock(blockData: string): Block {
    const previousBlock: Block = this.getLatestBlock();
    const nextIndex: number = previousBlock.index + 1
    const nextTimestamp: number = new Date().getTime() / 1000
    return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData);
  }

  private getLatestBlock(): Block {
    return this.blockchain[this.blockchain.length - 1];
  }
}