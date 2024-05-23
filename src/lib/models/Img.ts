import { Column, Table, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "imgs", timestamps: false })
export class Img extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  path!: string;

  @Column({ type: DataType.STRING })
  title?: string;

  @Column({ type: DataType.STRING })
  desc?: string;

  @Column({ type: DataType.STRING })
  tags?: string;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createAt?: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt?: Date;
}
