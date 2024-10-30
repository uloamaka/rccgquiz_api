import {
    BadRequestException,
    NotFoundException,
} from '../../Utils/service-error';
import bcryptService from '../../Services/bcrypt';
import jwt from '../../Services/jwt';
import { sendMail } from '../../Utils';
import UserModel, { User } from '../../Model/user';
import { authPayload, otpPayload, resetPayload } from './interface';
import { resetPassMail, confirmReset } from '../../Utils/email-templates';

export default class Service {
    private userModel: UserModel;

    constructor() {
        this.userModel = new UserModel();
    }
    async register(payload: authPayload) {
        try {
            const { username, email, password } = payload;

            const userExist = await this.userModel.UserExists(email);
            if (userExist) {
                throw new BadRequestException('Email already exists');
            }

            const hash = await bcryptService.hashPassword(password);

            const new_user = await this.userModel.CreateUser(
                username,
                email,
                hash
            );

            if (!new_user) {
                throw new Error('User registration failed');
            }
            const data = await jwt.generateToken(new_user.id);

            return {
                message: 'Registeration successful!',
                data,
            };
        } catch (error) {
            throw error;
        }
    }

    async login(payload: authPayload) {
        try {
            const { email, password } = payload;

            const user = await this.userModel.UserExists(email);
            if (!user) {
                throw new BadRequestException('User not found!');
            }

            const is_valid = await bcryptService.comparePassword(
                password,
                user.password
            );
            if (!is_valid)
                throw new BadRequestException('Incorrect email or password!');

            const data = await jwt.generateToken(user.id);

            return {
                message: 'Login successful!',
                data,
            };
        } catch (error) {
            throw error;
        }
    }

    async sendResetLink(payload: otpPayload) {
        try {
            const { email } = payload;
            const user = await this.userModel.UserExists(email);
            if (!user) {
                throw new BadRequestException('User not found!');
            }
            const resetLink = jwt.generateResetToken(
                user.id,
                user.email,
                user.password
            );
            await sendMail({
                to: user.email,
                subject: 'Password Reset Link',
                html: resetPassMail(resetLink),
            });
            return {
                message: 'Password Reset Link sent to email successfully!',
            };
        } catch (error) {
            throw error;
        }
    }

    async resetPass(payload: resetPayload, req_params: any) {
        try {
            const { resetToken, userId } = req_params;
            const { new_password } = payload;

            const user = await this.userModel.FindUserByID(userId)
            if (!user) {
                throw new NotFoundException('User not found!');
            }

            jwt.verifyResetToken(resetToken, user.password, (err: any) => {
                if (err) {
                    throw new BadRequestException(err.message);
                }
            });
            const hashedPassword = await bcryptService.hashPassword(new_password);
    
            await this.userModel.UpdateUserPassword(userId, hashedPassword);
            
            await sendMail({
                to: user.email,
                subject: 'Password Reset Successful',
                html: confirmReset(),
            });
            return {
                message: 'Password Reset successful!',
            };
        } catch (error) {
            throw error;
        }
    }
}
