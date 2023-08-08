const EventEmitter = require('events')
import { fBlocks } from './enums.js'
export class Registry extends EventEmitter {
    constructor() {
        super();
        this.registry = {}
        this.messageInProg = false
        this.lastMessageSeq = 0
        this.data = Buffer.alloc(65536)
        this.multiPartLength = 0
        this.finalData = null
    }

    parseMessage(data) {
        if(data.telId === 1) {
            this.registry = {}
            this.messageInProg = true
            this._addChunk(data)
        } else if(data.telId === 2) {
            console.log("continuing")
            let newSeq = data.data.readUint8(0)
            if(newSeq === (this.lastMessageSeq + 1)) {
                this._addChunk(data)
            } else {
                console.log("SEQUENCE ERROR")
            }
        } else if(data.telId === 3) {
            console.log("message finishing")
            this._addChunk(data)
            this.finalData = this.data.subarray(0, this.multiPartLength)
            this.data = Buffer.alloc(65536)
            this.lastMessageSeq = 0
            this.multiPartLength = 0
            this.messageInProg = false
            console.log("final data", this.finalData)
            this.parseRegistry()
        }
    }

    _addChunk(data) {
        this.lastMessageSeq = data.data.readUint8(0)
        data.data.copy(this.data, this.multiPartLength, 1, data.data.length)
        this.multiPartLength += data.telLen -1
    }

    parseRegistry() {
        for(let i=0;i<this.finalData.length;i+=4) {
            let tempFblockId = this.finalData.readUInt8(i+2)
            let readAbleName = tempFblockId in fBlocks ? fBlocks[tempFblockId] : tempFblockId
            if(!(readAbleName in this.registry)) {
                this.registry[readAbleName] = []
            }
            console.log(this.registry)
            this.registry[readAbleName].push({address: this.finalData.readUint16BE(i), instId: this.finalData.readUint8(i+3)})
            // if(!(readAbleName in this.centralRegistry)) {
            //     this.centralRegistry[readAbleName] = {}
            // }
            // this.centralRegistry[readAbleName][data.readUInt8(i+3)] = {instId: data.readUInt8(i+3), address: data.readUInt16BE(i), fBlock: tempFblockId, functions: {}}
        }
        console.log(this.registry)
        this.emit('registryComplete', this.registry)
    }
}
