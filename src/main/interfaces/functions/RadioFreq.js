const Function = require('./Function')

class RadioFreq extends Function {
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
        let stringEnd = data.indexOf(0x00)
        let x = data.readUInt32BE(stringEnd + 2)
        let preset = data.readUInt8(0)
        let status ={frequency: x, chosenPreset: preset}
        this.updateStatus(status)
        this.responseReceived = true
    }
}
module.exports = RadioFreq