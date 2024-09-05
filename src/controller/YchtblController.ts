import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { format } from 'date-fns';
import { Ychtbl } from "../entity/ychtbl";

export class YchtblController {
  private ychtblRepository = AppDataSource.getRepository(Ychtbl);
  async all(request: Request, response: Response, next: NextFunction) {
    return this.ychtblRepository.find();
  }
  async search(request: Request, response: Response, next: NextFunction) {
    try {
      const { query } = request.query;

      if (!query) {
        response.status(400);
        return { message: "Please provide a search query." };
      }

      // Pad the query with leading zeros to make it 6 characters long
      const paddedQuery = query.padStart(6, "0");

      console.log("Search value:", paddedQuery); // Add this line to log the search value

      const ychtbl = await this.ychtblRepository
        .createQueryBuilder("Ychtbl")
        .where("Ychtbl.IDnum LIKE :query", { query: `%${paddedQuery}%` })
        .orWhere("Ychtbl.Fullname LIKE :fullnameQuery", {
          fullnameQuery: `%${query}%`,
        })
        .getMany();

      return ychtbl;
    } catch (error) {
      console.error("Error searching for voters:", error);
      response.status(500);
      return { message: "Internal server error" };
    }
  }

  async pagination(request: Request, response: Response, next: NextFunction) {
    try {
      const limit: number = parseInt(request.query.limit, 100) || 100;
      const page: number = parseInt(request.query.page, 100) || 1;
      const offset = (page - 1) * limit;
      const query = this.ychtblRepository
        .createQueryBuilder("Ychtbl")
        .skip(offset)
        .take(limit);
      const ychtbl = await query.getMany();
      const totalItems = await query.getCount();
      const totalPages = Math.ceil(totalItems / limit);
      response.json({
        ychtbl,
        pageInfo: {
          totalItems,
          totalPages,
          currentPage: page,
        },
        meta: {
          limit,
          page,
        },
        links: {
          first: `${request.path}?limit=${limit}&page=1`,
          prev: page > 1 ? `${request.path}?limit=${limit}&page=${page - 1}` : null,
          next: page < totalPages ? `${request.path}?limit=${limit}&page=${page + 1}` : null,
          last: `${request.path}?limit=${limit}&page=${totalPages}`,
        },
      });
    } catch (error) {
      console.error("Error:", error);
      response.status(500).json({ message: "Internal server error" });
    }
  }

  async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      // Extract request body
      const { Date: date, Time: time, ...rest } = request.body;

      // Get current date and time
      const currentDate = new Date();

      // Format current date and time
      const defaultDate = date || format(currentDate, 'MM/dd/yyyy');
      const defaultTime = time || format(currentDate, 'h:mm a');

      // Create new record with default values if needed
      const ychtbl = this.ychtblRepository.create({
        ...rest,
        Date: defaultDate,
        Time: defaultTime,
      });

      await this.ychtblRepository.save(ychtbl);

      console.log("Record successfully created:", ychtbl); // Logs the record
      response.status(200).json({ message: "Record successfully created", data: ychtbl });
    } catch (error) {
      console.error("Error creating ychtbl:", error);
      response.status(500).json({ message: "Internal server error" });
    }
  }

}
