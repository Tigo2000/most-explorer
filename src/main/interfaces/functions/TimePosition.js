const Function = require('./Function')

class TimePosition extends Function {
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
        let x = data.readUInt8(0)
        let status ={media: {}}
        switch (x) {
            case 0:
                status.media.diskTime = data.readUInt32BE(2)
                status.media.trackTime = data.readInt32BE(6)
                status.media.titleTime = data.readUInt32BE(10)
                break
            case 1:
                status.media.diskTime = data.readInt32BE(2)
                break
            case 2:
                status.media.trackTime = data.readInt32BE(2)
                break
            case 3:
                status.media.titleTime = data.readInt32BE(2)
                break
        }
        this.updateStatus(status)
        this.responseReceived = true
    }
}
module.exports = TimePosition