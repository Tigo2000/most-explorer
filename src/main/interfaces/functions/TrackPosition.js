const Function = require('./Function')

class TrackPosition extends Function {
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
        let x = data.readUInt16BE(0)
        let status ={media: { trackPosition: x}}
        this.updateStatus(status)
        this.responseReceived = true
    }
}
module.exports = TrackPosition