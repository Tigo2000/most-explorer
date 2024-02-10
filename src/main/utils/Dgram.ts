import dgram, { Socket } from 'node:dgram'
import EventEmitter from "events";

export class Dgram extends EventEmitter{
  socket: Socket
  message: Buffer
  serverCheckInterval?: NodeJS.Timer
  constructor() {
    super()
    this.message = Buffer.from('Server?')
    this.socket = dgram.createSocket('udp4')
    this.socket.bind(8889)
    this.socket.on('listening', () => {
      this.emit('listening')
      this.socket.setBroadcast(true)
      this.serverCheckInterval = setInterval(() => {
        this.checkForServer()
      }, 5000)
    })

    this.socket.on('message', (_message, remote) => {
      console.log("server found", _message.toString())
      clearInterval(this.serverCheckInterval)
      this.emit('serverFound', remote.address)
    })
  }

  checkForServer(): void {
    this.socket.send(this.message, 0, this.message.length, 5555, "255.255.255.255")
  }

  restartCheck(): void {
    this.socket.setBroadcast(true)
    this.serverCheckInterval = setInterval(() => {
      this.checkForServer()
    }, 5000)
  }
}
