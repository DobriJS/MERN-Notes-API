import UserModel from '../models/User';
import { CreateUser } from '../interfaces/CreateUser';


const checkExistingUsername = async (username: string) => {
    const existingUsername = await UserModel.findOne({ username: username }).exec();
    return existingUsername;
};

const checkExistingEmail = async (email: string) => {
    const existingEmail = await UserModel.findOne({ email: email }).exec();
    return existingEmail;
};

const createUser = async ({ username, email, password }: CreateUser) => {
    const newUser = await UserModel.create({
        username: username,
        email: email,
        password: password
    });

    return newUser;
};

const getUser = async (username: string) => {
    const user = await UserModel.findOne({ username: username }).select("+password +email").exec();
    return user;
};

const authServices = {
    checkExistingUsername,
    checkExistingEmail,
    createUser,
    getUser
};

export default authServices;