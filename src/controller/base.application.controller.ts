import { AppError } from '../utils';
import { ERRORTYPES, RES_TYPES } from '../constant';
import { Request, Response, NextFunction } from 'express';

export class ApplicationController {
    model: any;
    constructor(model: any) {
        this.model = model;
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const Data = await this.model.create(req.body);
            return res.status(201).json({
                success: true,
                StatusCode: 201,
                data: Data,
                message: RES_TYPES.CREATE,
            });
        } catch (err) {
            return next(err);
        }
    }

    async bulkCreate(req: Request, res: Response, next: NextFunction) {
        try {
            const Data = await this.model.bulkCreate(req.body);
            if (!Data.length)
                throw new AppError(
                    RES_TYPES.SOMETHING_WRONG,
                    ERRORTYPES.INVALID_REQUEST,
                );
            return res.status(201).json({
                success: true,
                StatusCode: 201,
                data: Data,
                message: RES_TYPES.CREATE,
            });
        } catch (err) {
            return next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const [data] = await this.model.update(req.body, { where: { id } });
            if (!data || data === 0)
                throw new AppError(
                    RES_TYPES.ID_NOT_FOUND,
                    ERRORTYPES.NOT_FOUND,
                );
            return res.json({
                success: true,
                StatusCode: 200,
                message: RES_TYPES.UPDATE,
            });
        } catch (err) {
            return next(err);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const deleted = await this.model.destroy({ where: { id } });
            if (deleted) {
                return res.json({
                    success: true,
                    statusCode: 200,
                    data: deleted,
                    message: RES_TYPES.DELETE,
                });
            } else {
                return next(
                    new AppError(RES_TYPES.ID_NOT_FOUND, ERRORTYPES.NOT_FOUND),
                );
            }
        } catch (err) {
            return next(err);
        }
    }

    async getData(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.model.findAll({
                order: [['updatedAt', 'ASC']],
            });
            if (data.length) {
                return res
                    .status(200)
                    .json({ success: true, data, message: RES_TYPES.FETCH });
            }
            throw new AppError(RES_TYPES.NO_FOUND, ERRORTYPES.NOT_FOUND);
        } catch (err) {
            return next(err);
        }
    }

    async getDataFromId(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const data = await this.model.findOne({ where: { id } });
            if (!data || data === 0)
                throw new AppError(
                    RES_TYPES.ID_NOT_FOUND,
                    ERRORTYPES.NOT_FOUND,
                );
            if (data) {
                return res
                    .status(200)
                    .json({ success: true, data, message: RES_TYPES.FETCH });
            }
        } catch (err) {
            return next(err);
        }
    }
}
