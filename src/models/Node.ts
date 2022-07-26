import {Blockchain} from './Blockchain'
import * as  bodyParser from 'body-parser'
import express from 'express'
import {Block} from "./Block"
import {MessageType} from '../constants'
import {Message} from "./Message"
import {P2PServer} from "./P2PServer"

class Node {
  private blockChain: Blockchain
  private p2pServer: P2PServer

  constructor(p2pPort: number) {
    this.blockChain = new Blockchain()
    this.p2pServer = new P2PServer(p2pPort, this.blockChain)
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

    app.get('/peers', (req, res) => {
      res.send(this.p2pServer.getSockets().map((s: any) => s._socket.remoteAddress + ':' + s._socket.remotePort))
    })

    app.post('/addPeer', (req, res) => {
      this.p2pServer.connectToPeers(req.body.peer);
      res.send();
    });

    app.listen(myHttpPort, () => {
      console.log('Listening http on port: ' + myHttpPort)
    })
  }

  public generateNextBlock(blockData: string): Block {
    const previousBlock: Block = this.blockChain.getLatestBlock();
    const nextIndex: number = previousBlock.index + 1
    const nextTimestamp: number = new Date().getTime() / 1000
    let hash = this.blockChain.calculateHash(nextIndex, previousBlock.previousHash, nextTimestamp, blockData)
    return new Block(nextIndex, hash, previousBlock.hash, nextTimestamp, blockData)
  }


  private getBlockchain() {
    return this.blockChain.blockchainBlocks;
  }
}