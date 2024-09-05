import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { CustomEncryptionTransformer } from "../enryption/encrypt";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  user_id: string;

  @Column("text", { nullable: true, transformer: CustomEncryptionTransformer })
  firstName: string;

  @Column("text", { nullable: true, transformer: CustomEncryptionTransformer })
  lastName: string;

  @Column("text", { nullable: true, transformer: CustomEncryptionTransformer })
  email: string;

  @Column("text", { nullable: true })
  username: string;

  @Column("text", { nullable: true })
  password: string;

  @Column("text", { nullable: true })
  access_level: string;

  @Column("text", { nullable: true, transformer: CustomEncryptionTransformer })
  logged_in: string;
}
