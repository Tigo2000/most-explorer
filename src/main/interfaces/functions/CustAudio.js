const Function = require('./Function')

class CustAudio extends Function {
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
        let audioMode = data.readUInt8(0)
        switch (audioMode) {
            case 0x00:
                status.audio.mode = "stereo"
                break
            case 0x01:
                status.audio.mode = "3Channel"
                break
            case 0x02:
                status.audio.mode = "dolbyProLogic"
                break

        }
        this.updateStatus(status)
        this.responseReceived = true
    }


}
module.exports = CustAudio