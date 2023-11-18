import create from 'zustand'
import { Buffer } from 'buffer'
import { Registry, SelectedFBlock } from "../../resources/GlobalTypes";
import { SocketMostMessageRx } from "socketmost/dist/modules/Messages";

export interface NetworkStore {
  registry: Registry
  functions: number[]
  clearFunctions: () => void
}

export interface LogStore {
  loggingEnabled: boolean
  log: string
  setLoggingEnabled: (data: boolean) => void
  clearLog: () => void
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
  fBlock?: SelectedFBlock
  setOpen: (open: boolean) => void
  setFBlock: (fBlockID: FBlock) => void
  clearFBlock: () => void
  setRetrieveAudioModal: (open: boolean) => void
  setManualAll: (open: boolean) => void
}

export interface MessageStore {
  messages: SocketMostMessageRx[]
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
  setOpen: (open): void => set(() => ({ open: open })),
  setFBlock: (fBlock): void =>
    set(() => {
      const addrBuffer = Buffer.alloc(2)
      addrBuffer.writeUInt16BE(fBlock.targetAddress)
      const data: SelectedFBlock = {
        targetAddressHigh: addrBuffer.readUint8(0),
        targetAddressLow: addrBuffer.readUint8(1),
        fBlockID: fBlock.fBlockID,
        instanceID: fBlock.instanceID
      }
      return { fBlock: data }
    }),
  clearFBlock: (): void => set(() => ({ fBlock: undefined })),
  setRetrieveAudioModal: (open): void => set(() => ({ retrieveAudioModal: open })),
  setManualAll: (open): void => set(() => ({ manualOpen: open }))
}))

export const useLogStore = create<LogStore>()((set) => ({
  loggingEnabled: false,
  log: '',
  setLoggingEnabled: (data): void => {
    set(() => ({loggingEnabled: data}))
  },
  clearLog: (): void => {
    set(() => ({log: ''}))
  }
}))

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  filter: '',
  setFilter: (data): void => {
    set(() => ({ filter: data }))
  }
}))

window["most"].newMessage((_event, value: SocketMostMessageRx) => {
  console.log('new Message', _event, value)
  if (useMessageStore.getState().filter === '') {
    if (useLogStore.getState().loggingEnabled) {
      useLogStore.setState((state) => ({ log: state.log + '\n' + JSON.stringify(value) }))
    }
    useMessageStore.setState((state) => ({ messages: [value, ...state.messages.slice(0, 10)] }))
  } else if (value.fBlockID === parseInt(useMessageStore.getState().filter)) {
    if (useLogStore.getState().loggingEnabled) {
      useLogStore.setState((state) => ({ log: state.log + '\n' + JSON.stringify(value) }))
    }
    useMessageStore.setState((state) => ({ messages: [value, ...state.messages.slice(0, 10)] }))
  }
})

window["most"].appStatus((_event, value: number) => {
  console.log('appStatus', value)
  useStatusStore.setState(() => ({ appStatus: value }))
})

window["most"].registryUpdate((_event, value: Registry) => {
  console.log("registry", value)
  useNetworkStore.setState(() => ({ registry: value }))
  console.log(useNetworkStore.getState().registry)
})

window["most"].functions((_event, value) => {
  useNetworkStore.setState(() => ({ functions: value }))
})
