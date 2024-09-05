import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import { JWT } from "../middleware/auth";

export class UserController {
  private userRepository = AppDataSource.getRepository(User);
  private bcrypt = require("bcrypt");
  private jwt = new JWT();
  private saltRounds = 10;

  async all(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.find();
  }
  async one(request: Request, response: Response, next: NextFunction) {
    const filter = request.params.id;
    const user = await this.userRepository
      .createQueryBuilder("user")
      .where("user.username LIKE :query", { query: `%${filter}%` })
      .getMany();
    if (!user) {
      return response.status(404).send("user not found");
    }

    return user;
  }
  // async one(request: Request, response: Response, next: NextFunction) {
  //     const user_id = request.params.id;

  //     const user = await this.userRepository.findOne({
  //         where: { user_id }
  //     });

  //     if (!user) {
  //         return "unregistered user";
  //     }
  //     return user;
  // }
  // async signUp(request: Request, response: Response, next: NextFunction) {
  //     const userRepository = getRepository(User);
  //     const { firstName, lastName, username, email, password, access_level } = request.body;

  //     try {
  //         // Check if the user with the same username or email already exists
  //         const existingUser = await userRepository.findOne({ where: [{ username }, { email }] });

  //         if (existingUser) {
  //             response.status(409).json({ message: 'User already exists' });
  //             return;
  //         }

  //         // Hash the password using bcrypt
  //         const hashedPassword = await this.bcrypt.hash(request.body.password, 10); // Use bcrypt to hash the password

  //         const newUser = userRepository.create({
  //             firstName,
  //             lastName,
  //             username,
  //             email,
  //             password: hashedPassword, // Store the hashed password in the database
  //             access_level: access_level || 'users',
  //             logged_in: new Date().toISOString(),
  //         });

  //         await userRepository.save(newUser);

  //         // Omit the password field in the response
  //         const { password, ...userWithoutPassword } = newUser;

  //         response.status(201).json(userWithoutPassword);
  //     } catch (error) {
  //         response.status(500).json({ message: error.message });
  //     }
  // }
  async save(request: Request, response: Response, next: NextFunction) {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      access_level,
      logged_in,
    } = request.body;

    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      !access_level
    ) {
      response.status(400);
      console.log(request.body);
      return [{ message: "please fill up all the required fields" }];
    }
    const user = await this.userRepository.findOneBy({ username });
    if (user) {
      response.status(409);
      return [{ message: "user already exist" }];
    }

    try {
      let _hash = await this.bcrypt.hash(password, 10);
      const user = Object.assign(new User(), {
        username,
        firstName,
        lastName,
        email,
        password: _hash,
        access_level: "user",
        logged_in: new Date(),
      });
      return this.userRepository.save(user);
    } catch (err) {
      response.status(500);
      return [{ message: err.message }];
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const user_id = request.params.id;

    let userToRemove = await this.userRepository.findOneBy({ user_id });

    if (!userToRemove) {
      response.status(404);
      return "this user not exist";
    }
    response.status(200);
    await this.userRepository.remove(userToRemove);

    return "user has been removed";
  }

  async login(request: Request, response: Response, next: NextFunction) {
    const { username, password } = request.body;
    console.log(request.body);
    if (!username || !password) {
      response.status(400);
      return [{ message: "login name or password is empty" }];
    }
    const user = await this.userRepository.findOneBy({ username });
    // return user

    if (!user) {
      //add response status code for nt exist of user
      response.status(404);
      return [{ message: "user not exist" }];
    }
    const checkUser = await this.bcrypt.compare(password, user.password);
    if (!checkUser) {
      //add response status code for wrong password
      response.status(401);
      return [{ message: "wrong password" }];
    }
    // const generateToken = this.jwt.generateToken({ user_id: user.user_id, access_level: user.access_level });
    // response.status(200);
    // return [{ token: generateToken }];
    return user;
  }

  async logout(request: Request, response: Response, next: NextFunction) {
    response.clearCookie("auth_token");
    response.status(200).json({ message: "Logout successful" });
  }
}
