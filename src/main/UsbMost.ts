import EventEmitter from 'events'
import { SocketMostUsb } from 'socketmost'
import { BrowserWindow } from 'electron'
import { ErrorParser } from './utils/ErrorParser'
import { Parser } from './utils/MessageParser'
import { AppState, IoMostRx, REQ_REGISTRY } from '../resources/GlobalTypes'
import {
  MostRxMessage,
  Os8104Events,
  RetrieveAudio,
  SocketMostSendMessage,
  Source,
  Stream
} from 'socketmost/dist/modules/Messages'

export class UsbMost extends EventEmitter {
  win: BrowserWindow
  socketMost: SocketMostUsb
  errorParser: ErrorParser
  parser: Parser
  appState: number
  address: null | string

  constructor(win: BrowserWindow) {
    super()
    this.socketMost = new SocketMostUsb()
    this.parser = new Parser()
    this.win = win
    this.address = null
    this.errorParser = new ErrorParser()
    this.appState = AppState.loading
    this.updateAppState(this.appState)

    this.socketMost.on('opened', () => {
      this.updateAppState(AppState.connectingToSocket)
    })

    this.socketMost.on('error', () => {
      this.updateAppState(AppState.waitingForServer)
    })

    this.socketMost.on(Os8104Events.SocketMostMessageRxEvent, (message: MostRxMessage) => {
      if (message.opType === 0x0f) {
        try {
          this.win?.webContents.send('error', this.errorParser.parseError(message))
        } catch {
          this.win?.webContents.send('error', 'undefined error' + JSON.stringify(message))
        }
      } else {
        //Parse used functions to relevant data
        switch (message.fktID) {
          case 2561:
            console.log('reg update')
            this.parser.parseMessage(message, message.fktID)
            break
          case 0:
            message.fBlockID > 1 ? this.parser.parseMessage(message, message.fktID) : null
        }
        const messageOut: IoMostRx = { ...message, data: [...message.data] }
        this.win?.webContents.send('newMessage', messageOut)
      }
    })

    this.parser.on('registryComplete', (registry) => {
      this.win?.webContents.send('registryUpdate', registry)
    })

    this.parser.on('functions', (data) => {
      this.win?.webContents.send('functions', data)
    })
  }

  updateAppState(value: number): void {
    console.log('App State', AppState[value], value)
    this.appState = value
    this.win?.webContents.send('appStatus', value)
  }

  getRegistry(): void {
    // this.socket?.emit('requestRegistry')
    this.socketMost.sendControlMessage(REQ_REGISTRY)
  }

  sendControlMessage(data: SocketMostSendMessage): void {
    this.socketMost.sendControlMessage(data)
  }

  getSource(connectionLabel = 0): void {
    // this.socket?.emit('getSource', { connectionLabel })
    // this.socketMost.sendControlMessage(REQ_REGISTRY)
  }

  allocate(): void {
    // this.socket?.emit('allocate')
    this.socketMost.allocate()
  }

  stream(data: Stream): void {
    console.log('streaming')
    // this.socket?.emit('stream', data)
  }

  retrieveAudio(data: RetrieveAudio): void {
    console.log('retrieving audio')
    // this.socket?.emit('retrieveAudio', data)
  }

  connectSource(data: Source): void {
    console.log('connecting source', data)
    // this.socket?.emit(SocketTypes.ConnectSource, data)
  }

  disconnectSource(data: Source): void {
    // this.socket?.emit('disconnectSource', data)
  }
}
