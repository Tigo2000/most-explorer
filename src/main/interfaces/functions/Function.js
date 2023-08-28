

class Function {
    /**
     * @param {number} fktID
     * @param {writeMessage} writeMessage
     * @param {function} updateStatus
     */
    constructor(fktID, writeMessage, updateStatus) {
        /**
         *
         * @type {writeMessage}
         */
        this.writeMessage = writeMessage
        this.fktID = fktID
        this.responseReceived = false
        this.waiting = false
        this.messageSeq = 0x00
        this.multipartLength = 0x00
        this.multipartBuffer= Buffer.alloc(65536)
        this.updateStatus = updateStatus
    }

    async get(data=[]) {
        /**
         * @param {Object} data
         * @param {number} data.fBlockID
         * @param {number} data.instanceId
         * @param {number} data.fktID
         * @param {number} data.opType
         * @param {Buffer | Array<number>} data.data
         */
        this.responseReceived = false
        await this.writeMessage({fktID: this.fktID, opType: 0x01, data: data})
        this.waiting = true
        try {
            await this.awaitStatus()
        } catch {
           //console.log("message timed out")
        }
    }

    async getInterface(data=[]) {
        /**
         * @param {Object} data
         * @param {number} data.fBlockID
         * @param {number} data.instanceId
         * @param {number} data.fktID
         * @param {number} data.opType
         * @param {Buffer | Array<number>} data.data
         */
        this.responseReceived = false
        await this.writeMessage({fktID: this.fktID, opType: 0x05, data: data})
        this.waiting = true
        try {
            await this.awaitStatus()
        } catch {
           //console.log("message timed out")
        }
    }

    async set(data) {
        /**
         * @param {Object} data
         * @param {number} data.fBlockID
         * @param {number} data.instanceId
         * @param {number} data.fktID
         * @param {number} data.opType
         * @param {Buffer | Array<number>} data.data
         */
        this.responseReceived = false
        await this.writeMessage({fktID: this.fktID, opType: 0x00, data: data})
    }

    async increment(data) {
        /**
         * @param {Object} data
         * @param {number} data.fBlockID
         * @param {number} data.instanceId
         * @param {number} data.fktID
         * @param {number} data.opType
         * @param {Buffer | Array<number>} data.data
         */
        this.responseReceived = false
        await this.writeMessage({fktID: this.fktID, opType: 0x03, data: data})
    }

    async decrement(data) {
        /**
         * @param {Object} data
         * @param {number} data.fBlockID
         * @param {number} data.instanceId
         * @param {number} data.fktID
         * @param {number} data.opType
         * @param {Buffer | Array<number>} data.data
         */
        this.responseReceived = false
        await this.writeMessage({fktID: this.fktID, opType: 0x04, data: data})
    }

    async startResult(data) {
        /**
         * @param {Object} data
         * @param {number} data.fBlockID
         * @param {number} data.instanceId
         * @param {number} data.fktID
         * @param {number} data.opType
         * @param {Buffer | Array<number>} data.data
         */
        this.responseReceived = false
        await this.writeMessage({fktID: this.fktID, opType: 0x02, data: data})
    }

    async startResultAck(data) {
        /**
         * @param {Object} data
         * @param {number} data.fBlockID
         * @param {number} data.instanceId
         * @param {number} data.fktID
         * @param {number} data.opType
         * @param {Buffer | Array<number>} data.data
         */
        this.responseReceived = false
        await this.writeMessage({fktID: this.fktID, opType: 0x06, data: data})
    }

    async setGet(data) {
        /**
         * @param {Object} data
         * @param {number} data.fBlockID
         * @param {number} data.instanceId
         * @param {number} data.fktID
         * @param {number} data.opType
         * @param {Buffer | Array<number>} data.data
         */
        this.responseReceived = false
        await this.writeMessage({fktID: this.fktID, opType: 0x02, data: data})
    }

    async awaitStatus() {
        return new Promise((resolve, reject) => {
            let statusTimeOut
            let statusCheck = setInterval(() => {
                if(this.responseReceived === true) {
                    this.responseReceived = false
                    this.waiting = false
                    clearTimeout(statusTimeOut)
                    resolve()
                }
            },2)
            statusTimeOut = setTimeout(() => {
                this.responseReceived = false
                this.waiting = false
               console.log("message timed out")
                reject()
            }, 2000)
        })
    }

    /**
     *
     * @param {buffer} data
     * @param {number} telLen
     * @returns {Promise<void>}
     */
    async status(data, telLen) {

    }

    /**
     *
     * @param {buffer} data
     * @param telLen
     * @returns {Promise<void>}
     */
    async getReq(data=[], telLen, sourceAddrHigh, sourceAddrLow) {

    }

    /**
     *
     * @param {number} fktID
     * @param {number} opType
     * @param {number} telId
     * @param {number} telLen
     * @param {number} data
     * @param {number} instanceID
     * @returns {Promise<void>}
     */
    async parseStatus(fktID, opType, telId, telLen, data, instanceID) {
        let seq = data.readUint8(0)
       console.log(data, telId, telLen)

        switch (telId) {
            case 0:
                await this.status(data, telLen)
                break
            case 1:
                data.copy(this.multipartBuffer, this.multipartLength, 1, data.length)
                this.messageSeq = data.readUint8(0)
                this.multipartLength += telLen -1
                break
            case 2:
                if(this.multipartLength===0) {
                    this.messageSeq = 0x01
                    data.copy(this.multipartBuffer, this.multipartLength, 2, data.length)
                    this.multipartLength += telLen -2
                } else {
                    if(seq===0) {
                        this.messageSeq = seq
                        data.copy(this.multipartBuffer, this.multipartLength, 1, data.length)
                        this.multipartLength += telLen -1
                    } else {
                        if(seq === this.messageSeq + 1) {
                           console.log("message sequence continuing")
                            this.messageSeq = seq
                            data.copy(this.multipartBuffer, this.multipartLength, 1, data.length)
                            this.multipartLength += telLen -1
                        } else {
                           console.log("message sequence Error", seq, this.messageSeq, data)
                        }
                    }
                }

                break
            case 3:
                if(seq === this.messageSeq + 1 && this.multipartLength > 0) {
                   console.log("message sequence Ending")
                    if(this.multipartLength === 0) {
                        data.copy(this.multipartBuffer, this.multipartLength, 0, data.length)
                        this.multipartLength = telLen

                    } else {
                        this.messageSeq = seq
                        data.copy(this.multipartBuffer, this.multipartLength, 1, data.length)
                        this.multipartLength += telLen -1
                    }
                    let finalMessage = this.multipartBuffer.slice(0, this.multipartLength)
                    await this.status(finalMessage, this.multipartLength)
                    this.multipartLength = 0
                    this.multipartBuffer = Buffer.alloc(65536)
                    this.messageSeq = 0
                } else {
                   console.log("message sequence Error")
                    this.multipartLength = 0
                    this.multipartBuffer = Buffer.alloc(65536)
                    this.messageSeq = 0
                }
        }
    }
}

module.exports = Function