import { Sequelize } from "sequelize-typescript";
import path from "path";
import { app } from "electron";
import { Img } from "@models/index";

//表默认含:id,createdAt,updatedAt
export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.resolve(app.getPath("userData"), "db.sqlite"),
  models: [Img],
});

class Db {
  async initDb() {
    await sequelize.sync();
    console.log("[db]sync ok");
  }

  async getImages() {
    const imgs = await Img.findAll({ order: [["createAt", "DESC"]] });
    return imgs?.map((v) => v.path);
  }

  async saveImage(path: string) {
    await Img.create({ path });
  }

  async delImage(path: string) {
    if (!path) {
      console.error(`[db]delImage,path is null`);
      return;
    }
    await Img.destroy({ where: { path } });
  }
}
export const db = new Db();
