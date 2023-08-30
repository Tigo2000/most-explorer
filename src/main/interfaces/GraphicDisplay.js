const FktIDs = require('./functions/FktIDs')
const Notification = require('./functions/Notification')
const GetNotifications = require('./functions/GetNotifications')
const Fblock = require('./FBlock')

const {fktList} = require('../enums')


class GraphicDisplay extends Fblock{
    constructor(instID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow) {
        super(instID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow)
        this.fBlockID = 0x60
        this.writeMessage = writeMessage
        this.instID = instID
        this.sourceAddrHigh = sourceAddrHigh
        this.sourceAddrLow = sourceAddrLow
        this.status = {}
    }

}

module.exports = GraphicDisplay