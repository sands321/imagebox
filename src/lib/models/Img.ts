import { Column, Table, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "imgs" })
export class Img extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  path!: string;

  @Column({ type: DataType.STRING })
  desc?: string;

  @Column({ type: DataType.STRING })
  tags?: string;
}
