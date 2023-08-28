const { io } = require("socket.io-client");
const EventEmitter = require('events')
const dgram = require("dgram");
import { ErrorParser } from './ErrorParser'
import { Parser } from './Parser'

export class Most extends EventEmitter {
  constructor(win) {
    super();
    this.socketIo = null
    this.findServer = null
    this.appState = 1
    this.message = new Buffer('Server?')
    this.parser = new Parser()
    this.win = win
    this.errorParser = new ErrorParser()
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
      this.updateAppState(3)
      clearInterval(this.findServer)
      this.socketIo = io('ws://' + remote.address + ':5556')

      this.socketIo.on('message', (data) => {
        console.log("new message", data)
        if (data.opType === 0x0f) {
          try {
            this.win?.webContents.send('error', this.errorParser.parseError(data))
          } catch {
            this.win?.webContents.send('error', 'Undefined Error' + JSON.stringify(message))
          }
        } else {
          //Parse used functions to relevant data
          switch (data.fktID) {
            case 2561:
              this.parser.parseMessage(data, data.fktID)
              break
            case 0:
              console.log(data)
              data.fBlockID > 1 ? this.parser.parseMessage(data, data.fktID) : null
          }
          let messageOut = { ...data }
          messageOut.data = [...data.data]
          this.win?.webContents.send('newMessage', messageOut)
        }
      })

      this.socketIo.on('allocResults', (data) => {

      })

      this.socketIo.on('disconnect', () => {
        this.updateAppState(2)
        this.findServer = setInterval(() => {
          this.socket.send(this.message, 0, this.message.length, 5555, '255.255.255.255')
        }, 5000)
      })
    })

    this.parser.on('registryComplete', (data) => {
      this.win?.webContents.send('registryUpdate', data)
    })

    this.parser.on('functions', (data) => {
      this.win?.webContents.send('functions', data)
    })
  }

  updateAppState(value) {
    this.appState = value
    this.win?.webContents.send('appStatus', value)
  }

  getRegistry() {
    this.socketIo?.emit('requestRegistry')
  }

  sendControlMessage(data) {
    this.socketIo?.emit('sendControlMessage', data)
  }

  getSource(connectionLabel = 0) {
    this.socketIo?.emit('getSource', { connectionLabel })
  }

  allocate() {
    this.socketIo?.emit('allocate')
  }

  stream(data) {
    console.log("streaming")
    this.socketIo?.emit('stream', data)
  }
}
