const EventEmitter = require('events')
import { fBlocks } from './enums.js'
export class Parser extends EventEmitter {
  constructor() {
    super()
    this.registry = {}
    this.messageInProg = false
    this.lastMessageSeq = 0
    this.data = Buffer.alloc(65536)
    this.dataType = null
    this.multiPartLength = 0
    this.finalData = null
  }

  parseMessage(data, fkt) {
    if (data.telId === 1) {
      this.registry = {}
      this.dataType = fkt
      this.messageInProg = true
      this._addChunk(data)
    } else if (data.telId === 2) {
      console.log('continuing')
      let newSeq = data.data.readUint8(0)
      if (newSeq === this.lastMessageSeq + 1) {
        this._addChunk(data)
      } else {
        console.log('SEQUENCE ERROR')
      }
    } else if (data.telId === 3) {
      console.log('message finishing')
      this._addChunk(data)
      this.finalData = this.data.subarray(0, this.multiPartLength)
      this.data = Buffer.alloc(65536)
      this.lastMessageSeq = 0
      this.multiPartLength = 0
      this.messageInProg = false
      console.log('final data', this.finalData)
      switch (this.dataType) {
        case 2561:
          this.parseRegistry()
          break
        case 0:
          this.parseFktIds()
          break
      }
    } else if (data.telId === 0) {
      this.finalData = data.data.subarray(0, data.telLen)
      this.data = Buffer.alloc(65536)
      this.dataType = fkt
      this.lastMessageSeq = 0
      this.multiPartLength = 0
      this.messageInProg = false
      switch (this.dataType) {
        case 2561:
          this.parseRegistry()
          break
        case 0:
          this.parseFktIds()
          break
      }
    }
  }

  _addChunk(data) {
    this.lastMessageSeq = data.data.readUint8(0)
    data.data.copy(this.data, this.multiPartLength, 1, data.data.length)
    this.multiPartLength += data.telLen - 1
  }

  parseRegistry() {
    for (let i = 0; i < this.finalData.length; i += 4) {
      let tempFblockId = this.finalData.readUInt8(i + 2)
      let readAbleName = tempFblockId in fBlocks ? fBlocks[tempFblockId] : tempFblockId
      if (!(readAbleName in this.registry)) {
        this.registry[readAbleName] = []
      }
      console.log(this.registry)
      this.registry[readAbleName].push({
        address: this.finalData.readUint16BE(i),
        instId: this.finalData.readUint8(i + 3),
        fBlockId: tempFblockId
      })
      // if(!(readAbleName in this.centralRegistry)) {
      //     this.centralRegistry[readAbleName] = {}
      // }
      // this.centralRegistry[readAbleName][data.readUInt8(i+3)] = {instId: data.readUInt8(i+3), address: data.readUInt16BE(i), fBlock: tempFblockId, functions: {}}
    }
    console.log(this.registry)
    this.emit('registryComplete', this.registry)
  }

  parseFktIds() {
    // Function list is an RLE coded bit field, unsure if below is anywhere near efficient
    let functions = []
    console.log("functions", this.finalData)
    for (let i = 0; i < this.finalData.length - 1; i += 3) {
      functions.push((this.finalData.readUint16BE(i) >> 4).toString(16))
      if (i + 1 < this.finalData.length - 1) {
        functions.push((this.finalData.readUint16BE(i + 1) & 0xfff).toString(16))
      }
    }
    if (functions[functions.length - 1] === '0') {
      console.log('popping 0')
      functions.pop()
    }

    let activeData = []
    let enabled = true
    for (let i = 0; i < 4096; i++) {
      if (functions.indexOf(i.toString(16)) > -1) {
        console.log('switching enabled', i.toString(16))
        enabled = enabled ? false : true
      }
      if (enabled) {
        activeData.push(i.toString(16))
      }
    }
    this.emit('functions', activeData)
  }
}
