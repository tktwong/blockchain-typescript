import {Blockchain} from './Blockchain'
import * as  bodyParser from 'body-parser'
import express from 'express'
import * as _ from 'lodash'
import {Block} from "./Block";

class Node {
  private blockChain: Blockchain

  constructor(blockChain: Blockchain) {
    this.blockChain = blockChain
  }

  public replaceChain(newBlockchain: Blockchain) {
    if (newBlockchain.isValidChain() && newBlockchain.isDeeperThan(this.blockChain)) {
      console.log('Received blockchain is valid. Replacing current blockchain with received blockchain')
      this.blockChain = newBlockchain
      this.broadcastLatest()
    } else {
      console.log('Received blockchain invalid')
    }
  }

  public initHttpServer(myHttpPort: number) {
    const app = express()
    app.use(bodyParser.json())

    app.get('/blocks', (req, res) => {
      res.send(this.getBlockchain())
    })

    app.post('/mineBlock', (req, res) => {
      const newBlock: Block = this.generateNextBlock(req.body.data)
      res.send(newBlock)
    })

  }

  public generateNextBlock(blockData: string): Block {
    const previousBlock: Block = this.blockChain.getLatestBlock();
    const nextIndex: number = previousBlock.index + 1
    const nextTimestamp: number = new Date().getTime() / 1000
    let hash = this.blockChain.calculateHash(nextIndex, previousBlock.previousHash, nextTimestamp, blockData)
    return new Block(nextIndex, hash, previousBlock.hash, nextTimestamp, blockData)
  }

  private broadcastLatest() {

  }


  private getBlockchain() {
    return this.blockChain.blockchainBlocks;
  }
}