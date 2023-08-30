const Function = require('./Function')

class asyncControl extends Function {
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
        data = data.readUInt8(0)
        let asyncControl = {
            asyncControlType: data ? 'packet' : 'control'
        }
        this.updateStatus(asyncControl)
        this.responseReceived = true
    }
}
module.exports = asyncControl