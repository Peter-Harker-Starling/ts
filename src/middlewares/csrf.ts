import { Request, Response, NextFunction } from 'express';

const csrfCheck = (req: Request, res: Response, next: NextFunction) => {
    const allowedOrigin = process.env.FRONTEND_URL;
    const origin = req.headers.origin;

    if (['POST', 'PATCH', 'DELETE'].includes(req.method!) && origin !== allowedOrigin) {
        return res.status(403).json({ error: "CSRF 驗證失敗" });
    };
    next();
};

export default csrfCheck;