import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Ychtbl {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column()
  IDnum: string;

  @Column()
  Fullname: string;

  @Column()
  Address: string;

  @Column()
  Brgy: string;

  @Column()
  Date: string;

  @Column()
  Time: string;

  @Column({ default: "YCID_2024" })
  Status: string;

  @Column({ default: "YCID_2024" })
  Encoder: string;
}

