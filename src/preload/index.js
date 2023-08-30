import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('electronAPI', {
      sendMessage: (message) => ipcRenderer.invoke('sendMessage', message),
      newMessage: (callback) => ipcRenderer.on('newMessage', callback),
      error: (callback) => ipcRenderer.on('error', callback),
      appStatus: (callback) => ipcRenderer.on('appStatus', callback),
      registryUpdate: (callback) => ipcRenderer.on('registryUpdate', callback),
      functions: (callback) => ipcRenderer.on('functions', callback),
      requestRegistry: () => ipcRenderer.invoke('requestRegistry'),
      getSource: () => ipcRenderer.invoke('getSource'),
      allocate: () => ipcRenderer.invoke('allocate'),
      stream: (data) => ipcRenderer.invoke('stream', data)
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
