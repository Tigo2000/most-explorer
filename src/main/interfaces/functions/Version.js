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
        let majorVersion = data.readUInt8(0)
        let minorVersion = data.readUInt8(1)
        let build = data.readUInt8(2)
        let version = {
            majorVersion,
            minorVersion,
            build
        }
        this.updateStatus(version)
        this.responseReceived = true
    }
}
module.exports = asyncControl