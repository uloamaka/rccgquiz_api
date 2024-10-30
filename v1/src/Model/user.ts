import { model, Schema } from 'mongoose';

export interface IUser {
    id: string;
    username: string;
    email: string;
    avatar_url: String;
    password: string;
    role: 'Basic' | 'Admin';
    auth_type: 'form' | 'google' | 'github' | 'x';
}
const userSchema = new Schema(
    {
        username: {
            type: String,
        },
        email: {
            type: String,
            unique: true,
        },
        avatar_url: {
            type: String,
            default: '',
        },
        password: {
            type: String,
        },
        role: {
            type: String,
            enum: ['Basic', 'Admin'],
            default: 'Basic',
        },
        auth_type: {
            type: String,
            enum: ['form', 'google', 'github', 'x'],
            default: 'form',
        },
    },
    {
        required: true,
        timestamps: true,
    }
);
export const User = model<IUser>('User', userSchema);

export default class UserModel {
    async UserExists(email: string) {
        const userExist = await User.findOne({ email });
        return userExist;
    }

    async CreateUser(
        username: string,
        email: string,
        hash: string
    ): Promise<IUser | null> {
        try {
            const user = await User.create({
                username: username,
                email: email,
                password: hash,
            });
            return user;
        } catch (error) {
            console.error('Error creating user:', error);
            return null;
        }
    }

    async FindUserByID(userId: string) {
        const user = await User.findOne({ _id: userId });
        return user;
    }

    async UpdateUserPassword(userId: string, hashedPassword: string) {
        await User.updateOne(
            { _id: userId },
            { password: hashedPassword },
            {
                new: true,
            }
        );
        return null;
    }
}
