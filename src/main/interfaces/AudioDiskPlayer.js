const FktIDs = require('./functions/FktIDs')
const Notification = require('./functions/Notification')
const GetNotifications = require('./functions/GetNotifications')
const MixerLevel = require('./functions/MixerLevel')
const Volume = require('./functions/Volume')
const NextTrack = require('./functions/NextTrack')
const Fblock = require('./FBlock')
const AudioDiskInfo = require('./functions/AudioDiskInfo')
const TimePosition = require('./functions/TimePosition')
const DeckStatus = require('./functions/DeckStatus')
const TrackPosition = require('./functions/TrackPosition')
const FramePosition = require('./functions/FramePosition')
const MagazineStatus = require('./functions/MagazineSatus')
const ActiveMagazine = require('./functions/ActiveMagazine')
const ActiveDisk = require('./functions/ActiveDisk')
const MediaInfo = require('./functions/MediaInfo')
const DiskCount = require('./functions/DiskCount')


const {fktList} = require('../enums')
const RandomCd = require("./functions/RandomCd");

class AudioDiskPlayer extends Fblock{
    constructor(instID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow) {
        super(instID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow)
        this.fBlockID = 0x31
        this.writeMessage = writeMessage
        this.instID = instID
        this.sourceAddrHigh = sourceAddrHigh
        this.sourceAddrLow = sourceAddrLow
        this.status = {}
        this.fktList = {...fktList.general, ...fktList.amplifier}
        this.functions = {...this.functions, ...{
                0x467: new MixerLevel(0x467, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0x400: new Volume(0x400, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0xc34: new NextTrack(0xc34, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0x420: new AudioDiskInfo(0x420, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0x201: new TimePosition(0x0201, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0x200: new DeckStatus(0x200, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0x202: new TrackPosition(0x202, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0x203: new FramePosition(0x203, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0x410: new MagazineStatus(0x410, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0x411: new ActiveMagazine(0x411, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0x412: new ActiveDisk(0x412, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0x413: new MediaInfo(0x413, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0x414: new DiskCount(0x414, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0x450: new RandomCd(0x450, this.sendMessage.bind(this), this.updateStatus.bind(this))
            }
        }
       //console.log(this.sourceAddrHigh, this.sourceAddrLow)
        this.availableFunctions = {...this.availableFunctions, ...{
                getMixerLevels: this.getMixerLevels.bind(this),
                getVolume: this.getVolume.bind(this),
                nextTrack: this.nextTrack.bind(this),
                prevTrack: this.prevTrack.bind(this),
                getNextTrack: this.getTrack.bind(this),
                getDiskInfo: this.getDiskInfo.bind(this),
                getInterface: this.getInterface.bind(this),
                getTimePosition: this.getTimePosition.bind(this),
                play: this.play.bind(this),
                stop: this.stop.bind(this),
                pause: this.pause.bind(this),
                load: this.load.bind(this),
                unload: this.unload.bind(this),
                searchForward: this.searchForward.bind(this),
                searchBackward: this.searchBackward.bind(this),
                fastForward: this.fastForwardTime.bind(this),
                fastBackward: this.fastBackwardTime.bind(this),
                empty: this.empty.bind(this),
                retract: this.retract.bind(this),
                slowForward: this.slowForward.bind(this),
                slowBackward: this.slowBackward.bind(this),
                stepByStep: this.stepByStep.bind(this),
                preStop: this.preStop.bind(this),
                rewindToStart: this.rewindToStart.bind(this),
                forwardToEnd: this.forwardToEnd.bind(this),
                searchNext: this.searchStartNext.bind(this),
                searchLast: this.searchStartLast.bind(this),
                filePlay: this.filePlay.bind(this),
                fileTransfer: this.fileTransfer.bind(this),
                getTrackPosition: this.getTrackPosition.bind(this),
                setTrackPosition: this.setTrackPosition.bind(this),
                getFramePosition: this.getFramePosition.bind(this),
                setActiveDisk: this.setActiveDisk.bind(this),
                getMediaInfo: this.getMediaInfo.bind(this),
                getDiskCount: this.getDiskCount.bind(this),
                getAudioDiskInfo: this.getAudioDiskInfo.bind(this),
                randomDisk: this.randomDisk.bind(this),
                randomMagazine: this.randomMagazine.bind(this),
                randomOff: this.randomOff.bind(this)
            }
        }
    }

    // async getFunctions() {
    //    //console.log("getting functions")
    //     await this.functions[0x000].get()
    //    //console.log(this.status)
    //     this.status.forEach((data) => {
    //        //console.log(this.fktList[data])
    //     })
    // }

    async getMixerLevels() {
        await this.functions[0x467].get([0x01, 0x01])
    }

    //ONLY WORKS FOR CURRENT TRACK
    async getAudioDiskInfo() {
        await this.functions[0x420].get([0x01, 0x00])
    }

    async getDiskCount() {
        await this.functions[0x414].get()
    }

    async getInterface() {
        await this.functions[0xc34].getInterface()
    }

    async getMediaInfo() {
        await this.functions[0x413].get([0x01, 0x00])
    }

    async getTrack() {
        await this.functions[0xc34].get()
    }

    async getTrackPosition() {
        await this.functions[0x202].get()
    }

    async setTrackPosition() {
        await this.functions[0x202].increment([0x01])
    }

    async nextTrack() {
        await this.functions[0x202].increment([0x01])
    }

    async prevTrack() {
        await this.functions[0x202].decrement([0x01])
    }

    async getTimePosition() {
        await this.functions[0x201].get([0x00, 0x00])
    }

    async play() {
        await this.functions[0x200].set([0x00])
    }

    async stop() {
        await this.functions[0x200].set([0x01])
    }

    async pause() {
        await this.functions[0x200].set([0x02])
    }

    async load() {
        this.functions[0x200].set([0x03])
    }

    async unload() {
        await this.functions[0x200].set([0x04])
    }

    async searchForward() {
        await this.functions[0x200].set([0x05])
    }

    async searchBackward() {
        await this.functions[0x200].set([0x06])
    }

    async fastForwardTime() {
        await this.functions[0x200].set([0x07])
    }

    async fastBackwardTime() {
        await this.functions[0x200].set([0x08])
    }

    async empty() {
        await this.functions[0x200].set([0x09])
    }

    async retract() {
        await this.functions[0x200].set([0x0A])
    }

    async slowForward() {
        await this.functions[0x200].set([0x20])
    }

    async slowBackward() {
        await this.functions[0x200].set([0x21])
    }

    async stepByStep() {
        await this.functions[0x200].set([0x22])
    }

    async preStop() {
        await this.functions[0x200].set([0x23])
    }

    async rewindToStart() {
        await this.functions[0x200].set([0x30])
    }

    async forwardToEnd() {
        await this.functions[0x200].set([0x31])
    }

    async searchStartNext() {
        await this.functions[0x200].set([0x32])
    }

    async searchStartLast() {
        await this.functions[0x200].set([0x33])
    }

    async filePlay() {
        await this.functions[0x200].set([0x40])
    }

    async fileTransfer() {
        await this.functions[0x200].set([0x41])
    }

    async getFramePosition() {
        await this.functions[0x203].get()
    }

    async setActiveDisk(data) {
        await this.functions[0x412].set(data)
    }

    // async allNotifcations() {
    //     let tempFktId = Buffer.alloc(2)
    //     tempFktId.writeUint16BE()
    //     await this.functions[0x001].set([0x00, 0x01, 0x10])
    // }
    //
    // async getNotifcations(data) {
    //     let tempFktId = Buffer.alloc(2)
    //     tempFktId.writeUint16BE(data << 4)
    //     await this.functions[0x002].set([0x00, 0x01, 0x40, ...tempFktId])
    // }

    // async updateStatus(data) {
    //     this.status = data
    // }

    async getVolume() {
        await this.functions[0x400].get()
    }

    async getDiskInfo() {
        await this.functions[0x420].get([1, 0])
    }

    randomDisk() {
        this.functions[0x450].set([0x02])
    }

    async randomMagazine() {
        await this.functions[0x450].set([0x03])
    }

    async randomOff() {
        await this.functions[0x450].set([0x00])
    }

    sendMessage({fktID, opType, data}) {
        this.writeMessage({fBlockID: this.fBlockID, instanceID: this.instID, fktID, opType, data}, {sourceAddrHigh: this.sourceAddrHigh, sourceAddrLow: this.sourceAddrLow})
    }


}

module.exports = AudioDiskPlayer