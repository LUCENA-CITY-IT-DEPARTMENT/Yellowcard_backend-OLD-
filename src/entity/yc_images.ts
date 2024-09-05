import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Yc_images {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column()
  IDnum: string;

  @Column()
  Picture: string;

  @Column()
  Signature: string;

  @Column()
  KeyID: string;
}
