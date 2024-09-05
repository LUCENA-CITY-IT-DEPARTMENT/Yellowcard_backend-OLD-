import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { CustomEncryptionTransformer } from "../enryption/encrypt";
import { IdPicAndSigniture } from "./IdPicAndSigniture";

@Entity()
export class Voter {
  @PrimaryGeneratedColumn()
  voter_id: number;

  @Column("varchar", {
    nullable: true,

  })
  no: string;

  @Column("varchar", {
    nullable: true,

  })
  precinct_no: string;

  @Column("varchar", {
    nullable: true,

  })
  tag: string;

  @Column("varchar", { nullable: true })
  fullname: string;

  @Column("varchar", {
    nullable: true,

  })
  address: string;

  @Column("varchar", { nullable: true })
  barangay: string;

  @OneToOne(
    () => IdPicAndSigniture,
    (idPicAndSigniture) => idPicAndSigniture.voter
  )
  idPicAndSigniture: IdPicAndSigniture;
}
