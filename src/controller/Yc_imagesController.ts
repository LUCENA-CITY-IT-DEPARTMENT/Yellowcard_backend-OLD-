import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Yc_images } from "../entity/yc_images";
import path = require("path");

export class Yc_imagesController {
  private yc_imgRepository = AppDataSource.getRepository(Yc_images);

  async search(request: Request, response: Response, next: NextFunction) {
    try {
      const { query } = request.query;

      if (!query) {
        response.status(400);
        return { message: "Please provide a search query." };
      }
      const ycimg = await this.yc_imgRepository
        .createQueryBuilder("Yc_images")
        .where("Yc_images.IDnum = :query", { query })
        .getOne();

      return ycimg;
    } catch (error) {
      console.error("Error searching for voters:", error);
      response.status(500);
      return { message: "Internal server error" };
    }
  }
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const ycimg = await this.yc_imgRepository.save(request.body);
      response.status(200);
      return ycimg;

    } catch (error) {
      console.error("Error creating voter:", error);
      response.status(500);
      return { message: "Internal server error" };
    }
  }
}
