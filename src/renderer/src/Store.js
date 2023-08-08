// useCounterState.ts
import create from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'
import { socket } from './socket';
import _ from 'lodash'
import { produce, current } from 'immer'

//import {Buffer} from "buffer";
// using the create with generics
export const useNetworkStore = create((set) => ({
    registry: {}
}));

export const useMessageStore = create((set) => ({
    messages: [],
    filter: '',
    setFilter: (data) => {
        set((state) => ({filter: data}))
    }
}))

export const useStatusStore = create((set) => ({
    appStatus : 0,
    open: false,
    AudioDiskPlayer: {},
    240: {
        data: {
            audioVolume: 0
        }
    },
    amFmTuner: {
        data: {
            currentPreset: 'fm1',
            autoStore: false
        }
    },
    setAutoStore: (data) =>
        set(produce((state) => {state.amFmTuner.data.autoStore = data})),
    setOpen: (open) =>
        set((state) => ({open: open}))
})
)

export const useLogStore = create((set) => ({
    loggingEnabled: false,
    log: '',
    setLoggingEnabled: (data) => {
        set((state) => ({loggingEnabled: data}))
    },
    setLog: () => {
        set((state) => ({log: ''}))
    }
}))


window.electronAPI.newMessage((_event, value) => {
    console.log("new Message", _event, value)
    if(useMessageStore.getState().filter === '') {
        if(useLogStore.getState().loggingEnabled) {
            useLogStore.setState(state => ({log: state.log + "\n" + JSON.stringify(value)}))
        }
        useMessageStore.setState(state => ({messages: [value, ...state.messages.slice(0, 10)]}))
    } else if(value.fBlockID === parseInt(useMessageStore.getState().filter)) {
        if(useLogStore.getState().loggingEnabled) {
            useLogStore.setState(state => ({log: state.log + "\n" + JSON.stringify(value)}))
        }
        useMessageStore.setState(state => ({messages: [value, ...state.messages.slice(0, 10)]}))
    }
})

window.electronAPI.appStatus((_event, value) => {
    console.log("appStatus", value)
    useStatusStore.setState(state => ({appStatus: value}))
})

window.electronAPI.registryUpdate((_event, value) => {
    useNetworkStore.setState(state => ({registry: value}))
    console.log(useNetworkStore.getState().registry)
})
