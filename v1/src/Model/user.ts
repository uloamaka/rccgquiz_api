import { model, Schema } from 'mongoose';
import { authPayload } from '../Apis/auth/interface';

export interface IUser {
    id: string;
    email: string;
    password: string;
    parish_name: string;
    personal_name: string;
    phone_number: string;
    user_image: String;
    residental_address: string;
    role: 'Basic' | 'Admin';
    category: 'YAYA' | 'Adults';
    class_name: string;
}

const userSchema = new Schema(
    {
        parish_name: {
            type: String,
        },
        personal_name: {
            type: String,
        },
        phone_number: {
            type: String,
        },
        residental_address: {
            type: String,
        },
        email: {
            type: String,
            unique: true,
        },
        user_image: {
            type: String,
            default: '',
        },
        password: {
            type: String,
        },
        class_name: {
            type: String,
        },
        role: {
            type: String,
            enum: ['Basic', 'Admin'],
            default: 'Basic',
            validate: {
                validator: (v: string) => v !== '',
                message: "Role can't be empty.",
            },
        },
        category: {
            type: String,
            enum: ['YAYA', 'Adults'],
            default: 'YAYA',
            validate: {
                validator: (v: string) => v !== '',
                message: "Category can't be empty.",
            },
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

    async CreateUser(userData: authPayload): Promise<IUser> {
        try {
            const user = await User.create({
                ...userData,
            });
            return user;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`User creation failed: ${error.message}`);
            }
            throw new Error('An unknown error occurred during user creation.');
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
        return 'password updated succesfully!';
    }
}
