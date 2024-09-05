import "reflect-metadata";
import { DataSource } from "typeorm";

import { Voter } from "./entity/Voter";
import { IdPicAndSigniture } from "./entity/IdPicAndSigniture";
import { User } from "./entity/User";
import { Ychtbl } from "./entity/ychtbl";
import { Yc_images } from "./entity/yc_images";

require("dotenv").config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [Ychtbl, Yc_images],
  migrations: [],
  subscribers: [],
});
