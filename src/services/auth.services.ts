import UserModel from '../models/User';
import bcrypt from 'bcrypt';

interface CreateUser {
    username: string,
    email: string,
    password: string,
}

const checkExistingUsername = async (username: string) => {
    const existingUsername = await UserModel.findOne({ username: username }).exec();
    return existingUsername;
};

const checkExistingEmail = async (email: string) => {
    const existingEmail = await UserModel.findOne({ email: email }).exec();
    return existingEmail;
};



const createUser = async ({ username, email, password }: CreateUser) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
        username: username,
        email: email,
        password: hashedPassword
    });

    return newUser;
};

const authServices = {
    checkExistingUsername,
    checkExistingEmail,
    createUser
};

export default authServices;