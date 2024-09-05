import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Voter } from "./Voter";

@Entity()
export class IdPicAndSigniture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_pic: string;

  @Column()
  signature: string;

  @Column()
  voter_id: number;

  @OneToOne(() => Voter)
  @JoinColumn({ name: "voter_id" })
  voter: Voter;
  // @OneToOne(() => Voter)
  // @JoinColumn()
  // voter: Voter;
}
