import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { Routes } from "./routes";
import { User } from "./entity/User";
import { Voter } from "./entity/Voter";

function handleError(err, req, res, next) {
  res.status(err.status || 500).send({ message: err.message });
}

AppDataSource.initialize()
  .then(async () => {
    const app = express();


    // const filePath = "/berina/id.jpg";
    // app.use("/static/images", (req, res, next) => {
    //   res.sendFile(filePath, { root: "/" });
    // });
    const path = require("path");
    app.use("/api/yc_img/:filename", (req, res, next) => {
      const YcimgPath = process.env.YCIMG_PATH;
      const { filename } = req.params;
      // console.log('IMAGE PATH:', YcimgPath);

      const filePath = path.join(YcimgPath, filename);
      res.sendFile(filePath);
    });
    app.use("/api/yc_sign/:filename", (req, res, next) => {
      const YcsignPath = process.env.YCSIGN_PATH;
      const { filename } = req.params;
      // console.log('SIGNATURE PATH:', YcsignPath);

      const filePath = path.join(YcsignPath, filename);
      res.sendFile(filePath);
    });

    app.use(bodyParser.json());
    const cors = require("cors");
    app.use(
      cors({
        origin: "*",
        methods: "GET", // Add other methods if required (e.g., POST, PUT)
      })
    );

    Routes.forEach((route) => {
      (app as any)[route.method](
        route.route,
        async (req: Request, res: Response, next: Function) => {
          try {
            const result = await new (route.controller as any)()[route.action](
              req,
              res,
              next
            );
            res.json(result);
            console.log(result);
          } catch (error) {
            next(error);
          }
        }
      );
    });

    app.use(handleError);
    const server = app.listen(3000, "192.168.0.131", () => {
      const { address, port } = server.address();
      console.log(`Express server has started on http://${address}:${port}`);
    });
  })
  .catch((error) => console.log(error));
