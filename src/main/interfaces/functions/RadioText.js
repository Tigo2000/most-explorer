const Function = require('./Function')

class RadioText extends Function {
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
        let tempString = data.slice(2)
        let stringEnd = tempString.indexOf(0x00)
        //console.log("radio text", tempString.slice(0, stringEnd -1).toString())
        let status = {}
        status.currentStation = tempString.slice(0, stringEnd).toString()
        this.updateStatus(status)
        this.responseReceived = true
    }
}
module.exports = RadioText