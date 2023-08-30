const FktIDs = require('./functions/FktIDs')
const Notification = require('./functions/Notification')
const GetNotifications = require('./functions/GetNotifications')
const Fblock = require('./FBlock')
const D00 = require('./functions/D00')

const {fktList} = require('../enums')


class Vehicle extends Fblock{
    constructor(instID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow) {
        super(instID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow)
        this.fBlockID = 0x05
        this.writeMessage = writeMessage
        this.instID = instID
        this.sourceAddrHigh = sourceAddrHigh
        this.sourceAddrLow = sourceAddrLow
        this.status = {}
    }

}

module.exports = Vehicle