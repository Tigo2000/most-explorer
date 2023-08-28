const Function = require('./Function')

class Loudness extends Function {
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
        let status ={audio: {loudness: data.readUInt8(0)}}
        this.updateStatus(status)
        this.responseReceived = true
    }


}
module.exports = Loudness