const Function = require('./Function')

class RandomCd extends Function {
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
        switch(x) {
            case 0x00:
                status.media.shuffle = 'off'
                break
            case 0x02:
                status.media.shuffle = "disk"
                break
            case 0x03:
                status.media.shuffle = 'magazine'
                break
            case 0x04:
                status.media.shuffle = 'allMagazines'
                break
        }

        this.updateStatus(status)
        this.responseReceived = true
    }


}
module.exports = RandomCd