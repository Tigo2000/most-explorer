const FktIDs = require('./functions/FktIDs')
const Notification = require('./functions/Notification')
const GetNotifications = require('./functions/GetNotifications')
const Fblock = require('./FBlock')
const D00 = require('./functions/D00')

const {fktList} = require('../enums')


class AuxIn extends Fblock{
    constructor(instID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow) {
        super(instID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow)
        this.fBlockID = 0x24
        this.writeMessage = writeMessage
        this.instID = instID
        this.sourceAddrHigh = sourceAddrHigh
        this.sourceAddrLow = sourceAddrLow
        this.status = {}
        this.functions = {...this.functions, ...{
                0xD000: new D00(0xD00, this.sendMessage.bind(this), this.updateStatus.bind(this))
            }
        }
        //console.log(this.sourceAddrHigh, this.sourceAddrLow)
        this.availableFunctions = {...this.availableFunctions, ...{
                getTheD: this.getTheD.bind(this),
            }
        }
    }

    async getTheD() {
        this.functions[0xD000].get()
    }

}

module.exports = AuxIn