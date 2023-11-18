import { FaultCodes } from '../../resources/Enums'
import { SocketMostMessageRx } from 'socketmost/dist/modules/Messages'

export class ErrorParser {
  parsers: object
  faultCodes: object
  constructor() {
    this.faultCodes = FaultCodes
    this.parsers = {
      0x01: this.parse0x01,
      0x02: this.parse0x02,
      0x03: this.parse0x03,
      0x04: this.parse0x04,
      0x05: this.parse0x05,
      0x06: this.parse0x06,
      0x07: this.parse0x07,
      0x0a: this.parse0x0A,
      0x0b: this.parse0x0B,
      0x0c: this.parse0x0C,
      0x20: this.parse0x20,
      0x40: this.parse0x40,
      0x41: this.parse0x41,
      0x42: this.parse0x42,
      0x43: this.parse0x43
    }
  }
  parseError({ fBlockID, instanceID, fktID, data }: SocketMostMessageRx): string {
    return `Fblock: ${fBlockID} | instance: ${instanceID} | function: ${fktID} | Error: ${
      this.faultCodes[data[0]]
    } | extraInfo: ${this.parsers[data[0]](data)}`
  }

  parse0x01(): string {
    return 'None Found'
  }

  parse0x02(): string {
    return 'None Found'
  }

  parse0x03(): string {
    return 'None Found'
  }

  parse0x04(data: Buffer): string {
    return `Invalid OpType: ${data[1]}`
  }

  parse0x05(): string {
    return 'None Found'
  }

  parse0x06(data: Buffer): string {
    return `Invalid Parameter, parameter number: ${data[1]} parameter value: ${
      data[2] !== 0 ? data[2] : 'None Found'
    }`
  }

  parse0x07(data: Buffer): string {
    return `Parameter not available, parameter number: ${data[1]} parameter value: ${
      data[2] !== 0 ? data[2] : 'None Found'
    }`
  }

  parse0x0A(data: Buffer): string {
    return `Secondary most node, primary node Address: ${
      data[1].toString(16) + data[2].toString(16)
    }}`
  }

  parse0x0B(): string {
    return 'None Found'
  }

  parse0x0C(data: Buffer | number[]): string {
    switch (data[0]) {
      case 0x01:
        return 'First Segment Missing'
      case 0x02:
        return 'Target device does not provide enough buffers to handle a message of this size'
      case 0x03:
        return 'Unexpected segment number'
      case 0x04:
        return 'Too many unfinished segmentation messages pending'
      case 0x05:
        return 'Timeout while waiting for next segment'
      case 0x06:
        return 'Device not capable to handle segmented messages'
      case 0x07:
        return 'Segmented message has not been finished before the arrival of another message sent by the same node'
      case 0x08:
        return 'Reserved, must not be used'
      default:
        return 'none found'
    }
  }

  parse0x20(data: Buffer): string {
    switch (data[0]) {
      case 0x01:
        return 'Buffer overflow'
      case 0x02:
        return 'List overflow'
      case 0x03:
        return 'Element overflow'
      case 0x04:
        return 'Value not available'
      case 0x05:
        return 'Timeout while waiting for next segment'
      default:
        return 'Manufacturer specific'
    }
  }

  parse0x40(): string {
    return 'None Found'
  }

  parse0x41(): string {
    return 'None Found'
  }

  parse0x42(): string {
    return 'None Found'
  }

  parse0x43(): string {
    return 'None Found'
  }
}
