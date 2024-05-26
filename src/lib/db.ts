import { Sequelize } from "sequelize-typescript";
import path from "path";
import { app } from "electron";
import { Img } from "@models/index";
import sqlite3 from "sqlite3";

//表默认含:id,createdAt,updatedAt
export const sequelize = new Sequelize({
  dialect: "sqlite",
  //1.若无打包时报错:Please install sqlite3 package manually
  //2.未引用sqlite3时,打包时不拷贝node_sqlite3.node
  dialectModule: sqlite3,
  storage: path.resolve(app.getPath("userData"), "db.sqlite"),
  models: [Img],
});

class Db {
  async initDb() {
    await sequelize.sync();
    console.log("[db]sync ok");
  }

  //仅返回数据对象
  async getImages() {
    const imgs = await Img.findAll({ order: [["createAt", "DESC"]] });
    // return imgs?.map((v) => v.path);
    return imgs.map((x) => x.dataValues);
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
