import express from "express";
import * as bodyParser from "body-parser";
import {Block} from "./Block";
import {P2PServer} from "./P2PServer";
import {Blockchain} from "./Blockchain";

export class HttpServer {
  private readonly port: number
  private blockChain: Blockchain;
  private p2pServer: P2PServer;

  constructor(port: number, blockChain: Blockchain, p2pServer: P2PServer) {
    this.port = port;
    this.blockChain = blockChain;
    this.p2pServer = p2pServer;
  }

  public initHttpServer() {
    const app = express()
    app.use(bodyParser.json())

    app.get('/blocks', (req, res) => {
      res.send(this.blockChain.blockchainBlocks)
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

    app.listen(this.port, () => {
      console.log('Listening http on port: ' + this.port)
    })
  }

  // TODO: move to helper
  private generateNextBlock(blockData: string): Block {
    const previousBlock: Block = this.blockChain.getLatestBlock();
    const nextIndex: number = previousBlock.index + 1
    const nextTimestamp: number = new Date().getTime() / 1000
    let hash = this.blockChain.calculateHash(nextIndex, previousBlock.previousHash, nextTimestamp, blockData)
    return new Block(nextIndex, hash, previousBlock.hash, nextTimestamp, blockData)
  }

}