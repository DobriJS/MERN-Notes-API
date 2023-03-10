import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { SignUpBody } from "../interfaces/SignUpBody";
import { LoginBody } from "../interfaces/LoginBody";
import UserModel from '../models/User';
import bcrypt from 'bcrypt';
import authServices from "../services/auth.services";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.session.userId).select("+email").exec();

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

        const newUser = await authServices.createUser({ username, email, password });

        req.session.userId = newUser._id;

        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

export const logIn: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        if (!username || !password)
            throw createHttpError(400, 'Parameters missing');

        const user = await authServices.getUser(username);

        if (!user)
            throw createHttpError(401, "Invalid credentials");

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch)
            throw createHttpError(401, "Invalid credentials");

        req.session.userId = user._id;
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const logOut: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(200);
        }
    });
};