const { io } = require("socket.io-client");
const EventEmitter = require('events')
const dgram = require("dgram");
import { Registry } from './Registry'

export class Most extends EventEmitter {
  constructor(win) {
    super();
    this.socketIo = null
    this.findServer = null
    this.appState = 1
    this.message = new Buffer('Server?')
    this.registry = new Registry()
    this.win = win
    this.socket = dgram.createSocket('udp4')
    this.socket.bind('8889')
    //Socket Listeners
    this.socket.on('listening', () => {
      console.log("listening")
      this.updateAppState(2)
      this.socket.setBroadcast(true)
      this.findServer = setInterval(() => {
        this.socket.send(this.message, 0, this.message.length, 5555, '255.255.255.255')
      }, 5000)
    })
    this.socket.on('message', (message, remote) => {
      console.log('Found Most Explorer Server')
      this.updateAppState(3)
      clearInterval(this.findServer)
      this.socketIo = io('ws://' + remote.address + ':5556')

      this.socketIo.on('message', (data) => {
        data.fktID === 2561 ? this.registry.parseMessage(data) : null
        let messageOut = { ...data }
        messageOut.data = [...data.data]
        this.win?.webContents.send('newMessage', messageOut)
      })

      this.socketIo.on('disconnect', () => {
        this.updateAppState(2)
        this.findServer = setInterval(() => {
          this.socket.send(this.message, 0, this.message.length, 5555, '255.255.255.255')
        }, 5000)
      })
    })

    this.registry.on('registryComplete', (data) => {
      this.win?.webContents.send('registryUpdate', data)
    })
  }

  updateAppState(value) {
    this.appState = value
    this.win?.webContents.send('appStatus', value)
  }

  getRegistry() {
    this.socketIo?.emit('requestRegistry')
  }

  getSource(connectionLabel = 0) {
    this.socketIo?.emit('getSource', { connectionLabel })
  }
}


