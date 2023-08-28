const Function = require('./Function')

class RadioSetPreset2 extends Function {
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
        console.log("preset update", data)
        // let status ={audio: {balance: data.readInt8(0)}}
        // this.updateStatus(status)
        // this.responseReceived = true
    }


}
module.exports = RadioSetPreset2