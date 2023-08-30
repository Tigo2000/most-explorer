const Function = require('./Function')

class Subwoofer extends Function {
    /**
     *
     * @param fktID
     * @param writeMessage
     * @param updateStatus
     */
    constructor(fktID, writeMessage, updateStatus) {
        super(fktID, writeMessage, updateStatus);
    }

    /**
     *
     * @param {Buffer} data
     * @param {number} telLen
     * @returns {Promise<void>}
     */
    async status(data, telLen) {
        let status ={audio: {subwoofer: data.readInt8(0)}}
        this.updateStatus(status)
        this.responseReceived = true
    }


}
module.exports = Subwoofer