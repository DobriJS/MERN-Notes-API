import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import env from "../util/validateEnv";

export const generateJwt = (id: Types.ObjectId, username: string) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            { id, username },
            env.JWT_SECRET!,
            { expiresIn: "4h" },
            (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            }
        );
    });
};