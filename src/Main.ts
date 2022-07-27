import {Node} from './models/Node'
import {Command} from "commander"

const program = new Command()

program.command('start')
  .option('--p2p-port <p2pPort>', 'P2P server port')
  .option('--http-port <httpPort>', 'Http Server port')
  .action((options) => {

    const node = new Node(Number(options.p2pPort), Number(options.httpPort))
    node.start()
  })


program.parse()


