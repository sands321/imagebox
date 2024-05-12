// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// import { contextBridge, ipcRenderer } from "electron";

//1.仅contextIsolation为true时，才能使用contextBridge
// contextBridge.exposeInMainWorld("rpc", {
//   send: (channel: string, data: any) => ipcRenderer.send(channel, data),
//   sendSync: (channel: string, data: any) => ipcRenderer.sendSync(channel, data),
// });
