import { Request, Response } from "express";
import { IGetPlatformAnalyticsUC } from "../../../domain/useCases/analytics/get-platform-analytics.uc.interface";
import { HttpStatus } from "../../../common/enums";
import asyncHandler from "../utils/async-handler";

export class AnalyticsController {
    constructor(private _getPlatformAnalyticsUC: IGetPlatformAnalyticsUC) { }


    getPlatformAnalytics = asyncHandler(async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        const analytics = await this._getPlatformAnalyticsUC.execute(limit, offset);

        return res.status(HttpStatus.OK).json({
            data: analytics,
        });
    });
}
