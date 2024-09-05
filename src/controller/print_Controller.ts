import { Request, Response, NextFunction } from "express";
import { YchtblController } from "./YchtblController";
import { Yc_imagesController } from "./Yc_imagesController";

export class PrintContorller {
  private ychtblController = new YchtblController();
  private ycImagesController = new Yc_imagesController();

  async combinedSearch(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { query } = request.query;

      if (!query) {
        response.status(400);
        return { message: "Please provide a search query." };
      }

      const result1 = await this.ychtblController.search(
        request,
        response,
        next
      );
      const result2 = await this.ycImagesController.search(
        request,
        response,
        next
      );

      // Combine the results from both controllers
      const combinedResult = {
        Ycid_profile: result1,
        Ycid_img: result2,
      };
      // console.log('Combined result:', combinedResult);

      return combinedResult;
    } catch (error) {
      console.error("Error in combined search:", error);
      response.status(500);
      return { message: "Internal server error" };
    }
  }
}
