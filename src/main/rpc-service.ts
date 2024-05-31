import { app, clipboard, ipcMain, nativeImage } from "electron";
import { ElUtil } from "../lib/elutil";
import { Img } from "@models/index";
import { db } from "../lib/db";
import fs from "fs";

export function initRpc() {
  console.log("rpcs>>init");
}

ipcMain.on("userDir", (event) => {
  event.returnValue = app.getPath("userData");
});
ipcMain.on("setCbImg", (event, url: string) => {
  console.log(`rpcs>>setCbImg,url:${url}`);
  const isGif = url.endsWith(".gif");
  //applescript有效>>set the clipboard to "/Users/cheng/Library/Application Support/imagebox/box/1715444621332.gif" as «class furl»
  if (isGif) {
    //微信废,chatgpt可
    // clipboard.write({
    //   text: `file://` + url,
    //   bookmark: path.basename(url),
    //   // image: ntvImg,
    // });
    //微信废,chatgpt可
    // clipboard.writeBuffer("public.file-url", Buffer.from(tmp, "utf-8"));
    //微信可
    clipboard.writeBuffer(
      "NSFilenamesPboardType",
      Buffer.from(`
        <?xml version="1.0" encoding="UTF-8"?>
        <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
        <plist version="1.0">
          <array>
            <string>${url}</string>
          </array>
        </plist>
      `)
    );
  } else {
    clipboard.writeImage(nativeImage.createFromPath(url));
  }
  event.returnValue = null;
});

ipcMain.on("setCbText", (event, url: string) => {
  console.log(`rpcs>>setCbText,url:${url}`);
  clipboard.writeText(url);
  event.returnValue = null;
});

ipcMain.on("syncDb", (event) => {
  console.log("rpcs>>syncDb");
  const ls = ElUtil.getImages();
  Img.bulkCreate(
    ls.map((v) => {
      const ts = fs.statSync(v).birthtime;
      return { path: v, createAt: ts, updatedAt: ts };
      // return { path: v, createAt: new Date("2020-01-01") };
    })
  );
  console.log(`rpcs>>syncDb,ls:${ls.length}`);
  event.returnValue = null;
});

ipcMain.on("getImages", async (event) => {
  console.log("rpcs>>getImages");
  event.returnValue = await db.getImages();
});

ipcMain.on("saveCbImg", async (event) => {
  const fullPath = await ElUtil.saveClipboardImage();
  //渲染进程不能import db,函数内import也不行
  await db.saveImage(fullPath);
  event.returnValue = null;
});

ipcMain.on("updateImg", async (event, img: any) => {
  await Img.update(img, { where: { path: img.path } });
  event.returnValue = null;
});

ipcMain.on("delImg", async (event, path: string) => {
  ElUtil.removeImage(path);
  await db.delImage(path);
  console.log(`rpcs>>delImg,path:${path}`);
  event.returnValue = null;
});
