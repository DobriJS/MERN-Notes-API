import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { SignUpBody } from "../interfaces/SignUpBody";
import { LoginBody } from "../interfaces/LoginBody";
import UserModel from '../models/User';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import authServices from "../services/auth.services";
import { generateJwt } from "../middlewares/jwtMethods";
import env from "../util/validateEnv";

export const getCurrentUser: RequestHandler = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token = authHeader?.replace('Bearer ', '');
    console.log(token);
    if (!token)
        throw createHttpError(404, 'Auth token was not found');

    try {
        const token_info: Jwt | JwtPayload | string | any = jwt.verify(token, env.JWT_SECRET);
        const user = await UserModel.findOne({ username: token_info.username });

        if (!user)
            throw createHttpError(400, 'User not found');

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }

};

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password)
            throw createHttpError(400, "Parameters missing");

        const existingUsername = await authServices.checkExistingUsername(username);

        if (existingUsername)
            throw createHttpError(409, "Username already taken. Please choose a different one or log in instead.");

        const existingEmail = await authServices.checkExistingEmail(email);

        if (existingEmail)
            throw createHttpError(409, "A user with this email address already exists. Please log in instead.");

        const passwordHashed = await bcrypt.hash(password, 10);

        const newUser = await UserModel.create({
            username: username,
            email: email,
            password: passwordHashed,
        });

        return res.status(201).json({ message: "succesful signup" });
    } catch (error) {
        next(error);
    }
};

export const logIn: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        if (!username || !password)
            throw createHttpError(400, 'Parameters missing');

        const user = await UserModel.findOne({ username: username }).select("+password +email").exec();

        if (!user)
            throw createHttpError(401, "Invalid credentials");

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch)
            throw createHttpError(401, "Invalid credentials");

        const token = await generateJwt(user._id, user.username);

        return res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
};