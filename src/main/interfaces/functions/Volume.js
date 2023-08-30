const Function = require('./Function')

class Volume extends Function {
    /**
     *
     * @param fktID
     * @param writeMessage
     * @param updateStatus
     */
    constructor(fktID, writeMessage, updateStatus) {
        super(fktID, writeMessage, updateStatus);
        this.volumes = {
            audioVolume: 0,
            parkingVolume: 0,
            navigationVolume: 0,
            phoneVolume: 0
        }
    }

    /**
     *
     * @param {Buffer} data
     * @param {number} telLen
     * @returns {Promise<void>}
     */
    async status(data, telLen) {
        let status = {}
        this.volumes.audioVolume = data.readUInt8(2)
        this.volumes.parkingVolume = data.readUInt8(10)
        this.volumes.navigationVolume = data.readUInt8(8)
        this.volumes.phoneVolume = data.readUInt8(8)
        status = {...status, ...this.volumes}
        this.updateStatus(status)
    }
}
module.exports = Volume