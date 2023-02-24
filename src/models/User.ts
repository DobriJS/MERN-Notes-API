import { InferSchemaType, model, Schema } from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, select: false },
    password: { type: String, required: true, select: false },
});

userSchema.pre('save', function (next) {
    bcrypt.hash(this.password, 10).then((hash) => {
        this.password = hash;

        next();
    });
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);