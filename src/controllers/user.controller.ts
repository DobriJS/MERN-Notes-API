import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { SignUpBody } from "../interfaces/SignUpBody";
import UserModel from '../models/User';


export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const { username, email } = req.body;
    const passwordRaw = req.body.password;

    try {
        if (!username || !email || !passwordRaw) {
            throw createHttpError(400, "Parameters missing");
        }

        const existingUsername = await UserModel.findOne({ username: username }).exec();

        if (existingUsername) {
            throw createHttpError(409, "Username already taken. Please choose a different one or log in instead.");
        }

        const existingEmail = await UserModel.findOne({ email: email }).exec();

        if (existingEmail) {
            throw createHttpError(409, "A user with this email address already exists. Please log in instead.");
        }


        res.status(201);
    } catch (error) {
        next(error);
    }
};
