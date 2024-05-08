import { app } from "electron";

export class ElUtil {
  static printPaths() {
    const b = {
      userData: app.getPath("userData"),
    };
    console.log(b);
  }
}
