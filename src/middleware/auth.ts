
import { NextFunction, Request, Response } from 'express';
import { Jwt } from 'jsonwebtoken';
require('dotenv').config();

export class JWT {
    private JWT_SECRET = process.env.SECRET_KEY;
    //create a function to generate token
    generateToken(data: { user_id: string, access_level: string }) {
        return JWT.sign(data, this.JWT_SECRET, { expiresIn: "10H" });
    }
    static sign(data: { user_id: string; access_level: string; }, JWT_SECRET: string, arg2: { expiresIn: string; }) {
        throw new Error('Method not implemented.');
    }
    //create a function to verify token
    static authenticateJWT(request: any, response: Response, next: NextFunction) {
        const header = request.headers.authorization;
        if (!header) {
            return response.status(401).json({ message: "unauthorized" })
        }
        try {
            const token = header.split(' ')[1];
            const decoded = JWT.verify(token, process.env.SECRET_KEY);
            request.decoded = decoded;
            next();
        } catch (err) {
            return response.status(500).json({ message: err.message })
        }
    }
    static verify(token: any, SECRET_KEY: string) {
        throw new Error('Method not implemented.');
    }
}
