//rp:无app/net
import { app, clipboard, nativeImage, net } from "electron";
import fs from "fs";
import path from "path";
import { exec } from "child_process";

export class ElUtil {
  static userDir = app?.getPath("userData");

  static printPaths() {
    const b = {
      userData: app.getPath("userData"),
    };
    console.log(b);
  }

  static getClipboardImage() {
    const image = clipboard.readImage();
    if (image.isEmpty()) {
      return;
    }
    const url = image.toDataURL();
    console.log(`elutil>>getClipboardImage,url_len:${url.length}`);
    return url;
  }

  //渲进实现粘贴会卡
  static setClipboardImage(path1: string) {
    //1.nativeImage.createFromPath禁gif
    //nativeImage.createFromPath(path)
    // const ntvImg = nativeImage.createFromBuffer(fs.readFileSync(path1));
    // clipboard.writeImage(ntvImg);
    // clipboard.writeBuffer("image/png", fs.readFileSync(path1));
    const tmp = `file://${path1}`;
    // const fileName = path.basename(path1);
    // clipboard.write({
    //   text: tmp,
    //   bookmark: path.basename(path1),
    // });
    // clipboard.writeBookmark(path.basename(path1), tmp);
  }

  static hasClipboardImage() {
    const cb = clipboard;
    //cb.availableFormats>>gif:[text/plain,text/uri-list],img:[image/png]
    const fmts = cb.availableFormats();
    console.log(
      `elutil>>hasClipboardImage,fmts:${JSON.stringify(
        fmts
      )},txt:${cb.readText()}`
    );
    const imgB = cb.readImage();
    if (!imgB.isEmpty()) {
      return true;
    }
    const tmp = cb.readText();
    if (this.isUrl(tmp)) {
      return true;
    }
    return false;
  }

  static async downImg(url: string) {
    return new Promise((resolve, reject) => {
      const fname = Date.now().toString();
      const suffix = url.match(/\.(png|jpe?g|gif|webp)$/i)?.[1] || "png";
      const f1 = path.resolve(this.userDir, `box/${fname}.${suffix}`);
      //1.禁referer>>https://pic.diydoutu.com/bq/2426.gif
      fetch(url, { referrerPolicy: "no-referrer" })
        .then((response) => response.blob())
        .then((blob) => blob.arrayBuffer())
        .then((arrayBuffer) => {
          fs.writeFile(f1, Buffer.from(arrayBuffer), (err) => {
            if (err) {
              console.error(`elutil>>downImg,error:${err}`);
              reject(err);
            } else {
              console.log(`elutil>>downImg ok`);
              resolve(f1);
            }
          });
        })
        .catch((err) => {
          console.error(`elutil>>downImg,error:${err}`);
          reject(err);
        });
    });
  }

  static isUrl(str: string) {
    const reg = new RegExp("^(http|https)://");
    return reg.test(str);
  }

  static async saveClipboardImage(relPath: string) {
    if (!this.userDir) {
      console.error("userDir is null");
      return;
    }
    const image = clipboard.readImage();
    if (!image.isEmpty()) {
      const buffer = image.toPNG();
      const f1 = path.resolve(this.userDir, relPath);
      const d1 = path.dirname(f1);
      if (!fs.existsSync(d1)) {
        fs.mkdirSync(d1, { recursive: true });
      }
      try {
        fs.writeFileSync(f1, buffer);
      } catch (e) {
        console.error(`elutil>>saveClipboardImage,${e}`);
      }
    } else {
      const tmp = clipboard.readText();
      if (this.isUrl(tmp)) {
        await this.downImg(tmp);
      }
    }
  }

  static getImages() {
    const dir = this.userDir;
    const d1 = path.resolve(dir, "box");
    if (!fs.existsSync(d1)) {
      return [];
    }
    const files = fs
      .readdirSync(d1)
      .filter((f) => !f.startsWith("."))
      .map((f) => path.resolve(d1, f));
    // .map((f) => path.join(`./box`, f))
    // .filter((f) => f.match(/\.(png|jpe?g|gif|webp)$/i));
    //时间倒序
    files.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
    return files;
  }

  static removeImage(f1: string) {
    if (!fs.existsSync(f1)) {
      return;
    }
    if (!f1.includes("/box/")) {
      console.error(`elutil>>removeImage,invalid path:${f1}`);
      return;
    }
    fs.unlinkSync(f1);
  }

  // --------

  static setImg2App(f1: string) {
    const code = `
tell application "WeChat"
    activate
    tell application "System Events"
        keystroke "v" using command down
    end tell
end tell
`;
    const tmpF = path.resolve(this.userDir, `tmp/tmp.applescript`);
    const d1 = path.dirname(tmpF);
    if (!fs.existsSync(d1)) {
      fs.mkdirSync(d1, { recursive: true });
    }
    fs.writeFileSync(tmpF, code);
    const cmd = `osascript "${tmpF}"`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`elutil>>setImg2App,error:${error}`);
        return;
      }
      console.log(`elutil>>setImg2App,stdout:${stdout}`);
    });
  }
}
