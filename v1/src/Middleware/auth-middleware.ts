import { Response, NextFunction } from 'express';
import jwt from '../Services/jwt';
import { UnauthorizedException } from '../Utils/service-error';
import { AuthenticatedRequest } from '../Apis/user-profile/interface';
import BaseController from '../Utils/base-controller';
import { StatusCodes } from 'http-status-codes';

const handleAuthError = (res: Response, message: string) => {
    return BaseController.responseHandler(
        res,
        StatusCodes.UNAUTHORIZED,
        message,
        null
    );
};

const userAuth = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const auth_header = req.headers.authorization;
        if (!auth_header || !auth_header.startsWith('Bearer')) {
            return handleAuthError(res, 'Authentication invalid');
        }

        const token = auth_header.split(' ')[1];
        if (!token) {
            return handleAuthError(res, 'No token provided');
        }

        try {
            const data = await jwt.verifyAccessToken(token);
            if (!data?.id) {
                return handleAuthError(res, 'Invalid token');
            }

            req.user = data.id;
            next();
        } catch (error) {
            return handleAuthError(res, 'Token verification failed');
        }
    } catch (error: any) {
        return BaseController.responseHandler(
            res,
            error.code || StatusCodes.INTERNAL_SERVER_ERROR,
            error.message || 'Internal server error',
            error.data || null
        );
    }
};

export default userAuth;
