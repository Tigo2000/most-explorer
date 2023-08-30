const Function = require('./Function')

class MagazineStatus extends Function {
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
        let status ={magazine: {}}
        switch (x) {
            case 0x00:
                status.magazine.state = 'NoMagazine'
                break
            case 0x01:
                status.magazine.state = 'MagazineLoaded'
                break
            case 0x02:
                status.magazine.state = "DiskCheck"
                break
            case 0x03:
                status.magazine.state = "DiskChange"
                break


        }
        this.updateStatus(status)
        this.responseReceived = true
    }
}
module.exports = MagazineStatus