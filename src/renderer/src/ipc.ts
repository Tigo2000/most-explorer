import { RetrieveAudio, SocketMostSendMessage, Source, Stream } from "socketmost/dist/modules/Messages";

export const requestRegistry = (): void => {
  window["most"].requestRegistry()
}

export const getSource = (): void => {
  window["most"].getSource()
}

export const sendMessage = (data: SocketMostSendMessage): void => {
  window["most"].sendMessage(data)
}

export const allocate = (): void => {
  window["most"].allocate()
}

export const stream = (data: Stream): void => {
  window["most"].stream(data)
}

export const retrieveAudio = (data: number[]): void => {
  window["most"].retrieveAudio(data)
}

export const connectSource = (data: Source): void => {
  console.log("ipc connect source request")
  window["most"].connectSource(data)
}

export const disconnectSource = (data: Source): void => {
  console.log("ipc connect source request")
  window["most"].disconnectSource(data)
}
