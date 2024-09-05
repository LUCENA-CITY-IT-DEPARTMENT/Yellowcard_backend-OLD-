import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Voter } from "../entity/Voter";
import * as CryptoJS from "crypto-js";
import { Like } from "typeorm/find-options/operator/Like";
import { CustomEncryptionTransformer } from "../enryption/encrypt";
import { IdPicAndSigniture } from "../entity/IdPicAndSigniture";

export class VoterController {
  private voterRepository = AppDataSource.getRepository(Voter);
  private voterPhotoRepository = AppDataSource.getRepository(IdPicAndSigniture);
  async all(request: Request, response: Response, next: NextFunction) {
    return this.voterRepository.find();
  }
  async pagination(request: Request, response: Response, next: NextFunction) {
    try {
      const limit: number = parseInt(request.query.limit, 100) || 100;
      const page: number = parseInt(request.query.page, 100) || 1;
      const offset = (page - 1) * limit;
      const query = this.voterRepository
        .createQueryBuilder("voter")
        .skip(offset)
        .take(limit);
      const voters = await query.getMany();
      const totalItems = await query.getCount();
      const totalPages = Math.ceil(totalItems / limit);
      response.json({
        voters,
        pageInfo: {
          totalItems,
          totalPages,
          currentPage: page,
        },
      });
    } catch (error) {
      console.error("Error:", error);
      response.status(500).json({ message: "Internal server error" });
    }
  }

  async search(request: Request, response: Response, next: NextFunction) {
    try {
      const { query } = request.query;

      if (!query) {
        response.status(400);
        return { message: "Please provide a search query." };
      }

      const voter = await this.voterRepository
        .createQueryBuilder("voter")
        .where("voter.voter_id LIKE :query", { query: `%${query}%` })
        .orWhere("voter.fullname LIKE :query", { query: `%${query}%` })
        .limit(1)
        .getMany();

      return voter;
    } catch (error) {
      console.error("Error searching for voters:", error);
      response.status(500);
      return { message: "Internal server error" };
    }
  }
  // async search(request: Request, response: Response, next: NextFunction) {
  //   try {
  //     const { query } = request.query;

  //     if (!query) {
  //       response.status(400);
  //       return { message: "Please provide a search query." };
  //     }

  //     const voter = await this.voterRepository
  //       .createQueryBuilder("voter")
  //       .where("voter.voter_id LIKE :query", { query: `%${query}%` })
  //       .orWhere("voter.fullname LIKE :query", { query: `%${query}%` })
  //       .getOne();

  //     console.log("Voter:", voter);

  //     return voter;
  //   } catch (error) {
  //     console.error("Error searching for voters:", error);
  //     response.status(500);
  //     return { message: "Internal server error" };
  //   }
  // }

  async search_one(request: Request, response: Response, next: NextFunction) {
    try {
      const { fullname, address, barangay } = request.query;
      if (!fullname || !address || !barangay) {
        return response.status(400).json({
          message: "a parameter is required",
        });
      }

      const voter_Data = this.voterRepository.createQueryBuilder("Voter");
      voter_Data
        .where("fullname LIKE :fullname", { fullname: `%${fullname}%` })
        .orWhere("address LIKE :address", { address: `%${address}%` })
        .orWhere("barangay LIKE :barangay", { barangay: `%${barangay}%` });

      return voter_Data;
    } catch (error) {
      return response.status(500).json({
        message: "error",
      });
    }
  }

  // async search_one(request: Request, response: Response, next: NextFunction) {
  //     const filter = request.params.id;
  //     // const filter = request.query.filter as string;
  //     const voter = await this.voterRepository
  //         .createQueryBuilder('voter')
  //         .where('fullname like :%filter%', { filter })
  //         .orWhere('precinct_no like :%filter%', { filter })
  //         .orWhere('address like :%filter%', { filter })
  //         .orWhere('barangay like :%filter%', { filter })
  //         .orWhere('voter_id like :%filter%', { filter })
  //         .orWhere('no = :%filter%', { filter })
  //         .getMany();

  //     if (!voter) {
  //         return response.status(404).send('Voter not found');
  //     }

  //     return voter;
  // }
  // async one(request: Request, response: Response, next: NextFunction) {
  //     const filter = request.params.id;
  //     const voter = await this.voterRepository.find({
  //         where: [
  //             { fullname: filter },
  //             { precinct_no: filter },
  //             { address: filter },
  //             { barangay: filter },
  //             { voter_id: filter },
  //         ],
  //     });

  //     if (!voter || voter.length === 0) {
  //         return response.status(404).send('Voter not found');
  //     }

  //     return voter;
  // }
  // async one(request: Request, response: Response, next: NextFunction) {
  //     const filter = request.params.id;

  //     const voter = await this.voterRepository.find({
  //         where: [
  //             { fullname: filter },
  //             { precinct_no: filter },
  //             { address: filter },
  //             { barangay: filter },
  //             { voter_id: filter }
  //         ]
  //     });

  //     if (!voter) {
  //         return "unregistered user";
  //     }
  //     return voter;
  // }

  // async one(request: Request, response: Response, next: NextFunction) {
  //     const voter_id = request.params.id;
  //     const voter = await this.voterRepository.findOne({
  //         where: { voter_id }
  //     });

  //     return voter;
  // }

  //api/voters/:id  request.param
  //api/voters?id=:id request.query

  async save(request: Request, response: Response, next: NextFunction) {
    const { no, precinct_no, tag, fullname, address, barangay } = request.body;
    const required_params = [
      "no",
      "precinct_no",
      "tag",
      "fullname",
      "address",
      "barangay",
    ];
    for (const required of required_params) {
      if (!(required in request.body)) {
        return "parameters does not exist";
      }
    }
    const voter = Object.assign(new Voter(), {
      no,
      precinct_no,
      tag,
      fullname,
      address,
      barangay,
    });

    return this.voterRepository.save(voter);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const voter_id = parseInt(request.params.id);
    let voterToRemove = await this.voterRepository.findOneBy({ voter_id });
    if (!voterToRemove) {
      return "this voter not exist";
    }
    await this.voterRepository.remove(voterToRemove);
    return "voter has been removed";
  }
}

// export async function saveIdPicAndSigniture(request: Request, response: Response, next: NextFunction) {
//     const { voter_id, id_pic, signature } = request.body;
//     const required_params = ["voter_id", "id_pic", "signature"];

//     for (const required of required_params) {
//       if (!(required in request.body)) {
//         return response.status(400).json({ error: "Parameters do not exist" });
//       }
//     }

//     const idPicAndSignitureRepository = getRepository(IdPicAndSigniture);

//     try {
//       const newIdPicAndSigniture = idPicAndSignitureRepository.create({
//         voter_id,
//         id_pic,
//         signature,
//       });

//       await idPicAndSignitureRepository.save(newIdPicAndSigniture);
//       response.status(201).json(newIdPicAndSigniture);
//     } catch (error) {
//       response.status(500).json({ error: "Failed to save IdPicAndSigniture" });
//     }
//   }
