/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * 渲染进程使用
 */
import { ipcRenderer } from "electron";

declare interface RPC {
  send: (channel: string, ...args: any[]) => void;
  sendSync: (channel: string, ...args: any[]) => any;
}

//@ts-ignore
// export const rpc: RPC = window.rpc;
export const rpc: RPC = ipcRenderer;

export function f1() {
  const clipboard = require("electron").clipboard;
  clipboard.writeText("Hello from main process!");
}
