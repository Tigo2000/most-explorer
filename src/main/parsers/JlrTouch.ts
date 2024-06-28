import { SocketMostClient, SocketMostUsb } from 'socketmost'
import {
  MostRxMessage,
  Os8104Events,
  SocketMostSendMessage
} from 'socketmost/dist/modules/Messages'
import EventEmitter from 'events'

export type SourceRecord = {
  fBlockID: number
  instanceID: number
  shadow: number
  addressHigh: number
  addressLow: number
  name: string
}
// 405 - assign shadow? 407 - allocate and connect, 406 - unassign shadow?, 408 - deallocate and disconenct

const sourceMap: Record<string, SourceRecord> = {
  amFmTuner: {
    fBlockID: 0x40,
    instanceID: 0x01,
    shadow: 0xa1,
    addressHigh: 0x01,
    addressLow: 0x80,
    name: 'amFmTuner'
  },
  dabTuner: {
    fBlockID: 0x43,
    instanceID: 0x01,
    shadow: 0xa1,
    addressHigh: 0x01,
    addressLow: 0x80,
    name: 'dabTuner'
  },
  audioDiskPlayer: {
    fBlockID: 0x31,
    instanceID: 0x02,
    shadow: 0xa1,
    addressHigh: 0x01,
    addressLow: 0x80,
    name: 'audioDiskPlayer'
  },
  usbAudio: {
    fBlockID: 0x31,
    instanceID: 0x05,
    shadow: 0xa2,
    addressHigh: 0x01,
    addressLow: 0x89,
    name: 'usbAudio'
  },
  unknown: {
    fBlockID: 0x23,
    instanceID: 0x05,
    shadow: 0xa1,
    addressHigh: 0x01,
    addressLow: 0x86,
    name: 'unknown'
  },
  auxIn: {
    fBlockID: 0x24,
    instanceID: 0x01,
    shadow: 0xa1,
    addressHigh: 0x01,
    addressLow: 0x80,
    name: 'auxIn'
  },
  carplay: {
    fBlockID: 0x24,
    instanceID: 0x01,
    shadow: 0xa1,
    addressHigh: 0x01,
    addressLow: 0x80,
    name: 'carplay'
  }
}
export class JlrTouch extends EventEmitter {
  driver: SocketMostUsb | SocketMostClient
  position: number
  connectInterval?: NodeJS.Timer
  sources: Record<string, SourceRecord>
  currentSource: null | SourceRecord
  nextSource: null | SourceRecord
  constructor(driver: SocketMostUsb | SocketMostClient) {
    super()
    this.driver = driver
    this.position = 0
    this.sources = sourceMap
    this.currentSource = null
    this.nextSource = null
    this.driver.on(Os8104Events.PositionUpdate, (data) => {
      console.log('updating position: ', data)
      this.position = data
      if (this.connectInterval) {
        clearTimeout(this.connectInterval)
      }
      this.connectInterval = setTimeout(() => {
        this.switchSource()
      }, 5000)
    })

    this.driver.on('unlocked', () => {
      this.currentSource = null
    })
  }

  parseMessage(message: MostRxMessage): void {
    if (message.fBlockID == 0x01 && message.fktID == 0x00) {
      this.sendFBlocks(message)
    } else if (message.fBlockID == 0x06 && message.fktID == 0xd22) {
      this.sendD22(message)
    } else if (message.fktID == 0x01) {
      this.sendNotifs(message)
    } else if (message.fktID === 0x405 && message.opType === 0x0d) {
      console.log('complete 405')
      this.emit('complete405')
    } else if (message.fktID === 0x405 && message.opType === 0x0b) {
      console.log('waiting 405')
    } else if (message.fktID === 0x101 && message.sourceAddrLow === 0x61) {
      this.send101()
    } else if (message.fktID === 0x407 && message.opType === 0x0d) {
      console.log('complete 407')
      this.emit('complete407')
    } else if (message.fktID === 0x407 && message.opType === 0x0b) {
      console.log('waiting 407')
    } else if (message.fktID === 0x406 && message.opType === 0x0d) {
      console.log('complete 406')
      this.emit('complete406')
    } else if (message.fktID === 0x406 && message.opType === 0x0b) {
      console.log('waiting 406')
    } else if (message.fktID === 0x408 && message.opType === 0x0d) {
      console.log('complete 408')
      this.emit('complete408')
    } else if (message.fktID === 0x408 && message.opType === 0x0b) {
      console.log('waiting 408')
    } else if (message.fktID === 0xda1 && message.opType === 0x02) {
      this.sendDa1(message)
    } else if (message.fktID === 0xc80 && message.opType === 0x06) {
      this.sendC80(message)
    }
    switch (message.fktID) {
      case 0xc81:
        this.sendFkt0xC81(message)
    }
  }

  sendFkt0xC81(message: MostRxMessage): void {
    const out: SocketMostSendMessage = {
      data: Buffer.from([]),
      fBlockID: message.fBlockID,
      fktID: message.fktID,
      instanceID: message.instanceID,
      opType: 0x0c,
      targetAddressHigh: message.sourceAddrHigh,
      targetAddressLow: message.sourceAddrLow
    }
    console.log('SENDING C81: ', out)
    this.driver.sendControlMessage(out)
    // switch (message.fBlockID) {
    //   case 0x40:
    //     break
    //   case 0x24:
    //     break
    //   case 0x31:
    //     break
    //   case 0x10:
    //     break
    //   case 0x50:
    //     break
    //   case 0x43:
    //     break
    // }
  }

  sendD22(message): void {
    const out: SocketMostSendMessage = {
      data: Buffer.from([
        0xf1, 0x8c, 0x30, 0x38, 0x31, 0x37, 0x32, 0x30, 0x33, 0x32, 0x34, 0x30, 0x30, 0x30, 0x00,
        0x00, 0x00, 0x00
      ]),
      fBlockID: message.fBlockID,
      fktID: message.fktID,
      instanceID: message.instanceID,
      opType: 0x0c,
      targetAddressHigh: message.sourceAddrHigh,
      targetAddressLow: message.sourceAddrLow
    }
    console.log('SENDING D22: ', out)
    this.driver.sendControlMessage(out)
  }

  // sendfBlock0x06(message: MostRxMessage): void {
  //   switch(message.fktID) {
  //     case 0x01:
  //       const outData = {...message}
  //       outData.data = Buffer.from([0x01,0x01,0x61,0x0e,0x10])
  //       outData.opType =
  //
  //   }
  // }

  sendFBlocks(message: MostRxMessage): void {
    const out: SocketMostSendMessage = {
      data: Buffer.from([
        0x10, 0xa3, 0x06, 0x6e, 0x40, 0xa1, 0x31, 0xa1, 0x52, 0xd1, 0x60, 0x01, 0x50, 0xa1, 0x05,
        0xd1, 0x24, 0xa1, 0x22, 0xd1, 0x11, 0xd1, 0x44, 0xa1, 0x05, 0xd2, 0x42, 0xa1, 0x31, 0xa2,
        0x43, 0xa1
      ]),
      fBlockID: message.fBlockID,
      fktID: message.fktID,
      instanceID: message.instanceID,
      opType: 0x0c,
      targetAddressHigh: message.sourceAddrHigh,
      targetAddressLow: message.sourceAddrLow
    }
    console.log('SENDING FBLOCKS: ', out)
    this.driver.sendControlMessage(out)
  }

  sendNotifs(message: MostRxMessage): void {
    const fkt = message.data.readUInt16BE(3)
    const out: SocketMostSendMessage = {
      fBlockID: message.fBlockID,
      fktID: fkt,
      instanceID: message.instanceID,
      opType: 0x0c,
      targetAddressHigh: message.sourceAddrHigh,
      targetAddressLow: message.sourceAddrLow,
      data: Buffer.from([])
    }
    switch (message.fBlockID) {
      case 0x10:
        out.data = Buffer.from([0x01])
        break
      case 0x40:
        out.data = Buffer.from([0x00])
        break
      case 0x60:
        if (fkt === 0xdb0) {
          out.data = Buffer.from([0x01, 0x00, 0x00])
        } else {
          out.data = Buffer.from([0, 0, 0, 0, 0])
        }
        break
      case 0x50:
        out.data = Buffer.from([0x00, 0x00, 0x00])
        break
    }
    if (out.data.length > 0) {
      console.log('SENDING NOTIF: ', out)
      this.driver.sendControlMessage(out)
    } else {
      console.log('unknown NOTIF: ', out)
    }
  }

  send405(): void {
    console.log('sending 405')
    const out: SocketMostSendMessage = {
      fBlockID: 0xf0,
      fktID: 0x405,
      instanceID: 0x01,
      opType: 0x06,
      targetAddressHigh: 0x01,
      targetAddressLow: 0x61,
      data: Buffer.from([
        0x0,
        0x02,
        this.nextSource!.fBlockID,
        this.nextSource!.shadow,
        0x01,
        0x01,
        this.nextSource!.fBlockID,
        this.nextSource!.instanceID,
        0x01,
        0x11
      ])
    }
    this.driver.sendControlMessage(out)
    this.once('complete405', () => {
      setTimeout(() => {
        this.send407()
      }, 5)
    })
  }

  send407(): void {
    console.log('sending 407')
    const out: SocketMostSendMessage = {
      fBlockID: 0xf0,
      fktID: 0x407,
      instanceID: 0x01,
      opType: 0x06,
      targetAddressHigh: 0x01,
      targetAddressLow: 0x61,
      data: Buffer.from([
        0x00,
        0x01,
        this.nextSource!.fBlockID,
        this.nextSource!.shadow,
        0x01,
        0x11
      ])
    }
    this.once('complete407', () => {
      setTimeout(() => {
        this.currentSource = this.nextSource
        this.startSource()
      }, 5)
    })
    this.driver.sendControlMessage(out)
  }

  send408(): void {
    console.log('sending 407')
    const out: SocketMostSendMessage = {
      fBlockID: 0xf0,
      fktID: 0x408,
      instanceID: 0x01,
      opType: 0x06,
      targetAddressHigh: 0x01,
      targetAddressLow: 0x61,
      data: Buffer.from([
        0x00,
        0x02,
        this.nextSource!.fBlockID,
        this.nextSource!.shadow,
        0x01,
        0x11
      ])
    }
    this.once('complete408', () => {
      setTimeout(() => {
        this.send406()
      }, 5)
    })
    this.driver.sendControlMessage(out)
  }

  send406(): void {
    console.log('sending 406')
    const out: SocketMostSendMessage = {
      fBlockID: 0xf0,
      fktID: 0x406,
      instanceID: 0x01,
      opType: 0x06,
      targetAddressHigh: 0x01,
      targetAddressLow: 0x61,
      data: Buffer.from([
        0x00,
        0x02,
        this.nextSource!.fBlockID,
        this.nextSource!.shadow,
        0x01,
        0x01,
        this.nextSource!.fBlockID,
        this.nextSource!.instanceID,
        0x01,
        0x11
      ])
    }
    this.once('complete406', () => {
      setTimeout(() => {
        this.send405()
      }, 5)
    })
    this.driver.sendControlMessage(out)
  }

  send101(): void {
    console.log('sending 101')
    const out: SocketMostSendMessage = {
      fBlockID: 0xf0,
      fktID: 0x101,
      instanceID: 0xa3,
      opType: 0x0c,
      targetAddressHigh: 0x01,
      targetAddressLow: 0x61,
      data: Buffer.from([0x01, 0x02, 0x20, 0x21])
    }
    this.driver.sendControlMessage(out)
  }

  switchSource(data: SourceRecord | null = null): void {
    console.log('switch source request', data)
    this.nextSource = data
    if (this.currentSource) {
      this.send408()
    } else {
      this.nextSource = this.sources.amFmTuner
      this.send405()
    }
  }

  sendDa1(message: MostRxMessage): void {
    const out: SocketMostSendMessage = {
      data: Buffer.from([]),
      fBlockID: message.fBlockID,
      fktID: message.fktID,
      instanceID: message.instanceID,
      opType: 0x0c,
      targetAddressHigh: message.sourceAddrHigh,
      targetAddressLow: message.sourceAddrLow
    }
    console.log('SENDING Da1: ', out)
    this.driver.sendControlMessage(out)
  }

  sendC80(message: MostRxMessage): void {
    const out: SocketMostSendMessage = {
      data: Buffer.from([0x00, 0x01]),
      fBlockID: message.fBlockID,
      fktID: message.fktID,
      instanceID: message.instanceID,
      opType: 0x0d,
      targetAddressHigh: message.sourceAddrHigh,
      targetAddressLow: message.sourceAddrLow
    }
    console.log('SENDING C80: ', out)
    this.driver.sendControlMessage(out)
  }

  startSource() {
    console.log('sending source start')
    let out: null | SocketMostSendMessage
    switch (this.currentSource!.fBlockID) {
      case 0x31:
        out = {
          fBlockID: this.currentSource!.fBlockID,
          fktID: 0x200,
          instanceID: this.currentSource!.instanceID,
          opType: 0x00,
          targetAddressHigh: this.currentSource!.addressHigh,
          targetAddressLow: this.currentSource!.addressLow,
          data: Buffer.from([0x00])
        }
        this.driver.sendControlMessage(out)
        break
      case 0x40:
        out = {
          fBlockID: this.currentSource!.fBlockID,
          fktID: 0x103,
          instanceID: this.currentSource!.instanceID,
          opType: 0x02,
          targetAddressHigh: this.currentSource!.addressHigh,
          targetAddressLow: this.currentSource!.addressLow,
          data: Buffer.from([0x01, 0x02])
        }
        this.driver.sendControlMessage(out)
    }
  }
}
