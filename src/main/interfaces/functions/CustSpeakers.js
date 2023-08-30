const Function = require('./Function')

class CustSpeakers extends Function {
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
        let status ={audio: {centre: data.readInt8(1)}}
        this.updateStatus(status)
        this.responseReceived = true
    }


}
module.exports = CustSpeakers