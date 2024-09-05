import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { IdPicAndSigniture } from "../entity/IdPicAndSigniture";

export class IdPicAndSignitureController {
  private voterPhotoRepository = AppDataSource.getRepository(IdPicAndSigniture);
  async all(request: Request, response: Response, next: NextFunction) {
    return this.voterPhotoRepository.find();
  }

  async search(request: Request, response: Response, next: NextFunction) {
    try {
      const { query } = request.query;

      if (!query) {
        return response
          .status(400)
          .json({ message: "Please provide a search query." });
      }

      const voterPhoto = await this.voterPhotoRepository
        .createQueryBuilder("idPicAndSigniture")
        // .leftJoinAndSelect("idPicAndSigniture.voter", "voter")
        .where("idPicAndSigniture.voter_id = :query", { query: query })
        // .orWhere("voter.fullname LIKE :query", { query: `%${query}%` })
        .limit(1)
        .getMany();

      console.log("Voter:", voterPhoto);
      return response.status(200).json(voterPhoto);
    } catch (error) {
      console.error("Error searching for voters:", error);
      return response.status(500).json({ message: "Internal server error" });
    }
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { voter_id, id_pic, signature } = request.body;

    // if (!voter_id || !id_pic || !signature) {
    //   response.status(400);
    //   return [{ message: "Please fill up all the required fields" }];
    // }

    const idPicAndSignature = Object.assign(new IdPicAndSigniture(), {
      voter_id,
      id_pic,
      signature,
    });

    try {
      return this.voterPhotoRepository.save(idPicAndSignature);
    } catch (err) {
      response.status(500);
      return [{ message: err.message }];
    }
  }

  async profile_save(request: Request, response: Response, next: NextFunction) {
    const { voter_id, id_pic } = request.body;

    try {
      console.log(
        "Debugging message: The saveIdPic function is being executed."
      );

      const existingVoter = await this.voterPhotoRepository.findOne({
        where: { voter_id: voter_id },
      });
      console.log(existingVoter);

      if (existingVoter) {
        existingVoter.id_pic = id_pic;
        await this.voterPhotoRepository.save(existingVoter);
        return response
          .status(200)
          .json({ message: "ID picture updated successfully" });
      } else {
        const newIdPicAndSignature = Object.assign(new IdPicAndSigniture(), {
          id_pic,
          signature: "",
          voter_id,
        });
        console.log(newIdPicAndSignature);

        await this.voterPhotoRepository.save(newIdPicAndSignature);
        return response
          .status(201)
          .json({ message: "New record created successfully" });
      }
    } catch (err) {
      console.error("Error:", err);
      return response.status(500).json({ message: err.message });
    }
  }

  async signature_save(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { voter_id, signature } = request.body;

    try {
      console.log(
        "Debugging message: The saveIdPic function is being executed."
      );

      const existingVoter = await this.voterPhotoRepository.findOne({
        where: { voter_id: voter_id },
      });
      console.log(existingVoter);

      if (existingVoter) {
        existingVoter.signature = signature;
        await this.voterPhotoRepository.save(existingVoter);
        return response
          .status(200)
          .json({ message: "ID picture updated successfully" });
      } else {
        const newIdPicAndSignature = Object.assign(new IdPicAndSigniture(), {
          signature,
          id_pic: "",
          voter_id,
        });
        console.log(newIdPicAndSignature);

        await this.voterPhotoRepository.save(newIdPicAndSignature);
        return response
          .status(201)
          .json({ message: "New record created successfully" });
      }
    } catch (err) {
      console.error("Error:", err);
      return response.status(500).json({ message: err.message });
    }
  }
  // async saveIdPic(request: Request, response: Response, next: NextFunction) {
  //   const { voter_id, id_pic } = request.body;
  //   try {
  //     // let doesVoterIDExist = await this.voterPhotoRepository.findOne({
  //     //   where: { voter_id: voter_id },
  //     // });

  //     // if (!doesVoterIDExist) {
  //     //   const idPicAndSignature = Object.assign(new IdPicAndSigniture(), {
  //     //     voter_id,
  //     //     id_pic,
  //     //   });
  //     // } else {
  //     //   const idPicAndSignature = Object.assign(doesVoterIDExist, {
  //     //     id_pic,
  //     //   });
  //     // }

  //     const idPicAndSignature = Object.assign(new IdPicAndSigniture(), {
  //       voter_id,
  //       id_pic,
  //     });
  //     return this.voterPhotoRepository.save(idPicAndSignature);
  //   } catch (err) {
  //     response.status(500);
  //     return [{ message: err.message }];
  //   }
  // }
}
