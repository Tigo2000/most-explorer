const Function = require('./Function')

class FramePosition extends Function {
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
        let x = data.readUInt32BE(0)
        let status ={frame: {position: x}}
        this.updateStatus(status)
        this.responseReceived = true
    }
}
module.exports = FramePosition