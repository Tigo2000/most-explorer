import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { Most } from "./Most";
import { RetrieveAudio, SocketMostSendMessage, Stream } from "socketmost/dist/modules/Messages";

let most: Most | undefined = undefined
let mainWindow: BrowserWindow
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows

  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  ipcMain.handle('requestRegistry', getRegistry)
  ipcMain.handle('getSource', getSource)
  ipcMain.handle('sendMessage', sendMessage)
  ipcMain.handle('allocate', allocate)
  ipcMain.handle('stream', stream)
  ipcMain.handle('retrieveAudio', retrieveAudio)

  most = new Most(mainWindow)

})

const getRegistry = (): void => {
  most?.getRegistry()
}

const getSource = (): void => {
  most?.getSource()
}

const allocate = (): void => {
  console.log('allocating')
  most?.allocate()
}

const sendMessage = (_sender, message: SocketMostSendMessage): void => {
  console.log("send message request: ", message)
  most?.sendControlMessage(message)
}

const stream = (_sender, message: Stream): void => {
  console.log("requesting stream", message)
  most?.stream(message)
}

const retrieveAudio = (_sender, message: RetrieveAudio): void => {
  console.log('retrieve audio', message)
  most?.retrieveAudio(message)
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
