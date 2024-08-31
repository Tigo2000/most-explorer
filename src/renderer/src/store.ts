import create from 'zustand'
import { Buffer } from 'buffer'
import { Registry, SelectedFBlock } from '../../resources/GlobalTypes'
import {
  MostRxMessage,
  SocketMostMessageRx,
  SocketMostSendMessage
} from 'socketmost/dist/modules/Messages'
import { Settings } from '../../main/Types'

export interface NetworkStore {
  registry: Registry
  functions: number[]
  clearFunctions: () => void
}

export interface LogStore {
  loggingEnabled: boolean
  log: string
  dataLog: Buffer
  logOnlyData: boolean
  setLoggingEnabled: (data: boolean) => void
  clearLog: () => void
  setLogOnlyData: (data: boolean) => void
  logCount: number
}

export interface FBlock {
  targetAddress: number
  fBlock: number | string
  instanceID: number
  fBlockID: number
}

export interface StatusStore {
  appStatus: number
  open: boolean
  retrieveAudioModal: boolean
  manualOpen: boolean
  sourceOpen: boolean
  settingsOpen: boolean
  fBlockModalOpen: boolean
  fBlock?: SelectedFBlock
  subscribedDevices: string[]
  setOpen: (open: boolean) => void
  setFBlock: (fBlockID: FBlock, callback?: (data: SelectedFBlock) => void) => void
  clearFBlock: () => void
  setRetrieveAudioModal: (open: boolean) => void
  setManualAll: (open: boolean) => void
  setSourceOpen: (open: boolean) => void
  setSettingsOpen: (open: boolean) => void
  setFBlockModalOpen: (open: boolean) => void
  toggleDeviceSubscription: (id: string) => void
}

export interface MostSettings {
  usb: boolean
  manualIp: boolean
  ip: string
  nodeAddressHigh: number
  nodeAddressLow: number
  groupAddress: number
  autoShutdown: false
  jlrSwitching: false
}

export interface MessageStore {
  messages: MostRxMessage
  filter: string
  setFilter: (data: string) => void
}

export const useNetworkStore = create<NetworkStore>()((set) => ({
  registry: {},
  functions: [],
  clearFunctions: (): void => {
    set(() => ({ functions: [] }))
  }
}))

export const useStatusStore = create<StatusStore>()((set) => ({
  appStatus: 0,
  open: false,
  retrieveAudioModal: false,
  manualOpen: false,
  sourceOpen: false,
  settingsOpen: false,
  fBlockModalOpen: false,
  subscribedDevices: [],
  setOpen: (open): void => set(() => ({ open: open })),
  setFBlock: (fBlock: FBlock, callback?: (data: SelectedFBlock) => void): void =>
    set(() => {
      const addrBuffer = Buffer.alloc(2)
      addrBuffer.writeUInt16BE(fBlock.targetAddress)
      const data: SelectedFBlock = {
        targetAddressHigh: addrBuffer.readUint8(0),
        targetAddressLow: addrBuffer.readUint8(1),
        fBlockID: fBlock.fBlockID,
        instanceID: fBlock.instanceID
      }
      if (callback) {
        callback(data) // optionally return the selected FBlock
      }
      return { fBlock: data }
    }),
  clearFBlock: (): void => set(() => ({ fBlock: undefined })),
  setRetrieveAudioModal: (open): void => set(() => ({ retrieveAudioModal: open })),
  setManualAll: (open): void => set(() => ({ manualOpen: open })),
  setSourceOpen: (open): void => set(() => ({ sourceOpen: open })),
  setSettingsOpen: (open): void => set(() => ({ settingsOpen: open })),
  setFBlockModalOpen: (open): void => set(() => ({ fBlockModalOpen: open })),
  toggleDeviceSubscription: (id: string): void => {
    set((state) => {
      const isSubscribed = state.subscribedDevices.includes(id);
      const updatedSubscribedDevices = isSubscribed
        ? state.subscribedDevices.filter((deviceId) => deviceId !== id)
        : [...state.subscribedDevices, id];

      return { subscribedDevices: updatedSubscribedDevices };
    });
  }
}))

export const useLogStore = create<LogStore>()((set) => ({
  loggingEnabled: false,
  log: '',
  logCount: 0,
  logOnlyData: false,
  dataLog: Buffer.alloc(0),
  setLoggingEnabled: (data): void => {
    set(() => ({ loggingEnabled: data }))
  },
  clearLog: (): void => {
    set(() => ({ log: '', dataLog: Buffer.alloc(0), logCount: 0 }))
  },
  setLogOnlyData: (data): void => {
    set(() => ({ logOnlyData: data }))
  }
}))

export const useMostSettings = create<MostSettings>()((set) => ({
  usb: false,
  manualIp: false,
  ip: '',
  nodeAddressHigh: 0x01,
  nodeAddressLow: 0x10,
  groupAddress: 0x22,
  autoShutdown: false,
  jlrSwitching: false
}))

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  filter: '',
  setFilter: (data): void => {
    set(() => ({ filter: data }))
  }
}))

window['most'].newMessage((_event, value: SocketMostMessageRx) => {
  console.log('new Message', _event, value)
  if (useMessageStore.getState().filter === '') {
    if (useLogStore.getState().loggingEnabled) {
      useLogStore.setState((state) => ({ log: state.log + '\n' + JSON.stringify(value) }))
      useMessageStore.setState((state) => ({ messages: [value, ...state.messages.slice(0, 10)] }))
    } else if (useLogStore.getState().logOnlyData) {
      if (value.fktID === 3362 && value.opType === 12) {
        let dataSliced
        if (value.data[2] > 1) {
          dataSliced = Buffer.from(value.data.slice(3, value.telLen))
          useLogStore.setState((state) => ({
            dataLog: Buffer.concat([state.dataLog, dataSliced]),
            logCount: state.logCount + 1
          }))
        } else if (value.data[2] === 1) {
          dataSliced = Buffer.from('\n')
          useLogStore.setState((state) => ({
            dataLog: Buffer.concat([state.dataLog, dataSliced]),
            logCount: state.logCount + 1
          }))
        }
      }
    } else {
      useMessageStore.setState((state) => ({ messages: [value, ...state.messages.slice(0, 10)] }))
    }
  } else if (value.fBlockID === parseInt(useMessageStore.getState().filter)) {
    if (useLogStore.getState().loggingEnabled) {
      useLogStore.setState((state) => ({ log: state.log + '\n' + JSON.stringify(value) }))
    }
    useMessageStore.setState((state) => ({ messages: [value, ...state.messages.slice(0, 10)] }))
  }
})

window['most'].appStatus((_event, value: number) => {
  console.log('appStatus', value)
  useStatusStore.setState(() => ({ appStatus: value }))
})

window['most'].registryUpdate((_event, value: Registry) => {
  console.log('registry', value)
  useNetworkStore.setState(() => ({ registry: value }))
  console.log(useNetworkStore.getState().registry)
})

window['most'].functions((_event, value) => {
  useNetworkStore.setState(() => ({ functions: value }))
})

window['most'].settingsUpdate((_event, value: Settings) => {
  useMostSettings.setState(() => value)
  console.log(useMostSettings.getState())
})
