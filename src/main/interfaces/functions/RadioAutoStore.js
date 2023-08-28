const Function = require('./Function')

class RadioAutoStore extends Function {
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
        console.log("AUTO STORE update", data)
        let status = {autoStore: false}
        this.updateStatus(status)
        this.responseReceived = true
    }


}
module.exports = RadioAutoStore