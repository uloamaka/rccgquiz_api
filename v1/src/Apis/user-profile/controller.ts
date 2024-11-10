import { Response } from "express";
import BaseController from "../../Utils/base-controller";
import Service from './service';
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "./interface";

export default class Controller extends BaseController {
    private service: Service;

    constructor() {
        super();
        this.service = new Service();
    }

    getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
        try {
            if (!req.user) {
                throw new Error('User not authenticated');
            }

            const result = await this.service.getUserProfile(req.user);
            this.responseHandler(
                res,
                StatusCodes.OK,
                result.message,
                result.data
            );
        } catch (error: any) {
            BaseController.responseHandler(
                res,
                error.code || StatusCodes.INTERNAL_SERVER_ERROR,
                error.message || 'Internal server error',
                error.data
            );
        }
    };
}