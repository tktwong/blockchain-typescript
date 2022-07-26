import {Blockchain} from './Blockchain'
import {P2PServer} from "./P2PServer"
import {HttpServer} from "./HttpServer";

class Node {
  private blockChain: Blockchain
  p2pServer: P2PServer
  private httpServer: HttpServer

  constructor(p2pPort: number, httpPort: number) {
    this.blockChain = new Blockchain()
    this.p2pServer = new P2PServer(p2pPort, this.blockChain)
    this.httpServer = new HttpServer(httpPort, this.blockChain, this.p2pServer)
  }

  public start() {
    this.p2pServer.initP2PServer()
    this.httpServer.initHttpServer()
  }

}

export {
  Node
}