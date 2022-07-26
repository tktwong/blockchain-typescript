import WebSocket, {Server} from "ws";
import {Message} from "./Message";
import {MessageType} from "../constants";
import {Blockchain} from "./Blockchain";
import {Block} from "./Block";
import _ from "lodash";

class P2PServer {
  private sockets: WebSocket[] = []
  private blockchain: Blockchain

  constructor(port: number, blockchain: Blockchain) {
    this.blockchain = blockchain
    this.init(port)
  }

  public getSockets(): WebSocket[] {
    return this.sockets;
  }

  private init(port: number) {
    const server: Server = new WebSocket.Server<WebSocket.WebSocket>({port: port})
    server.on('connection', (ws: WebSocket) => {
      this.initConnection(ws)
    })

    console.log(`listening websocket p2p port on: ${port}`)
  }

  public connectToPeers(newPeer: any) {
    const ws: WebSocket = new WebSocket(newPeer)
    ws.on('open', () => {
      this.initConnection(ws)
    })

    ws.on('error', () => {
      console.log('connection failed')
    })
  }

  private initConnection(ws: WebSocket) {
    this.sockets.push(ws)
    this.initMessageHandler(ws)
    this.initErrorHandler(ws)
    this.write(ws, this.queryChainLengthMsg())
  }

  private initMessageHandler(ws: WebSocket) {
    ws.on('message', (data: string) => {
      try {
        const message: Message | null = this.JSONToObject<Message>(data)
        if (message === null) {
          console.log('could not parse received JSON message: ' + data)
          return
        }

        switch (message.type) {
          case MessageType.QUERY_LATEST:
            this.write(ws, this.responseLatestMsg())
            break
          case MessageType.QUERY_ALL:
            this.write(ws, this.responseChainMsg())
            break
          case MessageType.RESPONSE_BLOCKCHAIN:
            const receivedBlocks: Block[] | null = this.JSONToObject<Block[]>(message.data)
            if (receivedBlocks === null) {
              console.log('invalid blocks received:')
              console.log(message.data)
              break
            }
            this.handleBlockchainResponse(receivedBlocks)
        }
      } catch (e) {

      }
    })
  }

  private broadcast(message: Message) {
    this.sockets.forEach((socket) => this.write(socket, message))
  }

  private write(ws: WebSocket, message: Message) {
    ws.send(JSON.stringify(message))
  }

  private JSONToObject<T>(data: string): T | null {
    try {
      return JSON.parse(data)
    } catch (e) {
      console.log(e)
      return null
    }
  }

  private responseChainMsg(): Message {
    return new Message(MessageType.RESPONSE_BLOCKCHAIN, JSON.stringify(this.blockchain.blockchainBlocks))
  }

  private initErrorHandler(ws: WebSocket) {
    const closeConnection = (myWs: WebSocket) => {
      console.log('connection failed to peer: ' + myWs.url)
      this.sockets.splice(this.getSockets().indexOf(myWs), 1)
    }

    ws.on('close', () => closeConnection(ws))
    ws.on('error', () => closeConnection(ws))
  }

  private queryAllMsg(): Message {
    return new Message(MessageType.QUERY_ALL, null)
  }

  private queryChainLengthMsg(): Message {
    return new Message(MessageType.QUERY_ALL, null);
  }

  private responseLatestMsg(): Message {
    return new Message(MessageType.RESPONSE_BLOCKCHAIN, JSON.stringify(this.blockchain.getLatestBlock()));
  }

  private handleBlockchainResponse(receivedBlocks: Block[]) {
    if (_.isEmpty(receivedBlocks)) {
      console.log('received block chain size of 0')
      return
    }

    const latestBlockReceived: Block = receivedBlocks[receivedBlocks.length - 1]

    if (!this.blockchain.isValidBlockStructure(latestBlockReceived)) {
      console.log('block structure not valid')
      return
    }

    const latestBlock = this.blockchain.getLatestBlock()

    if (latestBlockReceived.isDeeperThan(latestBlock)) {
      console.log('blockchain possibly behind. We got: ' + latestBlock.index + ' Peer got: ' + latestBlockReceived.index)
      if (latestBlock.hash === latestBlockReceived.previousHash) {
        if (this.blockchain.addBlock(latestBlockReceived)) {
          this.broadcast(this.responseLatestMsg())
        }
      } else if (receivedBlocks.length === 1) {
        console.log('We have to query the chain from our peer')
        this.broadcast(this.queryAllMsg())
      } else {
        console.log('Received blockchain is longer than current blockchain')
        if(this.blockchain.replace(receivedBlocks)){
          this.broadcastLatest()
        }
      }
    } else {
      console.log('received blockchain is not longer than held blockchain. Do nothing')
    }
  }

  private broadcastLatest() {
    this.broadcast(this.responseLatestMsg())
  }

}

export {
  P2PServer
}