import { app, clipboard, ipcMain, nativeImage } from "electron";

export function initRpc() {
  ipcMain.on("userDir", (event) => {
    event.returnValue = app.getPath("userData");
  });
  ipcMain.on("setCbImg", (event, url: string) => {
    console.log(`rpc>>setCbImg,url:${url}`);
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
}
