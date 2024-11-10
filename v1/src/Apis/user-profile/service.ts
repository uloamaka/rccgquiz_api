import UserModel from '../../Model/user';
import {
    BadRequestException,
    NotFoundException,
} from '../../Utils/service-error';

export default class Service {
    private userModel: UserModel;

    constructor() {
        this.userModel = new UserModel();
    }

    async getUserProfile(userId: string) {
        if (!userId) {
            throw new BadRequestException('User ID is required');
        }

        const userProfile = await this.userModel.FindUserByID(userId);
        if (!userProfile) {
            throw new BadRequestException('User profile not found!');
        }

        return {
            message: 'User profile retrieved successfully',
            data: userProfile,
        };
    }
}