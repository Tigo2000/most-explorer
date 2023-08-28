const Function = require('./Function')

class MediaInfo extends Function {
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
        let y = data.readUint8()
        let tempString = data.slice(2)
        let stringEnd = tempString.indexOf(0x00)
        tempString = tempString.slice(1, stringEnd)
        let status = {media: {disk: {}}}
        console.log(data)
        if(!(status.media.disk[x])) {
            status.media.disk[x] = {}
        }
        status.media.disk[x].albumName = tempString.toString()
        status.media.disk[x].type = data.readUInt8(stringEnd+3)
        status.media.disk[x].fileSystem = data.readUInt8(stringEnd + 4)
        status.media.disk[x].firstTrack = data.readUint16BE(stringEnd + 5)
        status.media.disk[x].lastTrack = data.readUint16BE(stringEnd + 7)
        status.media.disk[x].totalPlayTime = data.readUint32BE(stringEnd + 9)

        // let status ={media: {}}
        // switch (x) {
        //     case 0:
        //         status.media.diskTime = data.readUInt32BE(2)
        //         status.media.trackTime = data.readInt32BE(6)
        //         status.media.titleTime = data.readUInt32BE(10)
        //         break
        //     case 1:
        //         status.media.diskTime = data.readInt32BE(2)
        //         break
        //     case 2:
        //         status.media.trackTime = data.readInt32BE(2)
        //         break
        //     case 3:
        //         status.media.titleTime = data.readInt32BE(2)
        //         break
        // }
        this.updateStatus(status)
        this.responseReceived = true
    }
}
module.exports = MediaInfo