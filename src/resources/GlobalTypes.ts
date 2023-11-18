import { SocketMostMessageRx } from "socketmost/dist/modules/Messages";
import { IpcRendererEvent } from "electron";

export type RegistryEntry = {
  address: number,
  instanceID: number,
  fBlockID: number
}

export interface Registry {
  [registry: number | string]: RegistryEntry[];
}

export type IoMostRx = {
  eventType: string
  type: number
  sourceAddrHigh: number
  sourceAddrLow: number
  fBlockID: number
  instanceID: number
  fktID: number
  opType: number
  telID: number
  telLen: number
  data: number[]
}

export type SelectedFBlock = {
  targetAddressHigh: number,
  targetAddressLow: number,
  fBlockID: number,
  instanceID: number
}

export enum AppState {
  "loading" = 1,
  "waitingForServer",
  "connectingToSocket"
}

export interface PartialSendMessage {
  targetAddressHigh: number
  targetAddressLow: number
  fBlockID: number
  instanceID: number
  fktID?: number
  opType?: number
  data?: Buffer
}

export interface NewMessage {
  callback(event: IpcRendererEvent, message: SocketMostMessageRx[]): void;
}
