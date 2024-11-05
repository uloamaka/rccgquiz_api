import { Request, Response } from 'express';
import { UnprocessableContent } from './service-error';
import { Schema, validationResult } from 'express-validator';
import { SchemaDefinition, SchemaPreOptions } from 'mongoose';
import { ZodSchema } from 'zod';

class BaseController {
    validateRequest(req: Request) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let message = errors.array()[0].msg;
            throw new UnprocessableContent(message, errors.array());
        }
    }

    static validateRequest(req: Request, schema: ZodSchema) {
        const validationResult = schema.safeParse(req.body);
        if (!validationResult.success) {
            let errLog = validationResult.error.errors.map((err: any) => ({
                field: err.path.join('.'),
                message: err.message,
            }));
            throw new UnprocessableContent('Validation Error', errLog);
        }
    }

    responseHandler(
        res: Response,
        status: number = 500, 
        message: string,
        data: any = null
    ) {
        const statusCode = status || 500;

        res.status(statusCode).json({
            status: statusCode,
            error: /^4/.test(statusCode.toString()) ? true : false,
            message,
            data,
        });
    }

    static responseHandler(
        res: Response,
        status: number = 500,
        message: string,
        data: any = null
    ) {
        const statusCode = status || 500;

        res.status(statusCode).json({
            status: statusCode,
            error: /^4/.test(statusCode.toString()) ? true : false,
            message,
            data,
        });
    }

    extractPagingParams(req: Request) {
        let {
            limit,
            page,
            paginate,
        }: {
            limit?: string | number;
            page?: string | number;
            paginate?: boolean;
        } = req.query;
        limit = limit ? parseInt(`${limit}`) : 25;
        page = page ? (parseInt(`${page}`) < 1 ? 1 : parseInt(`${page}`)) : 1;

        return { limit, page, pagination: paginate };
    }
}

export default BaseController;
