import { Request, Response, NextFunction } from 'express';

const UNSAFE_METHODS = new Set(['POST', 'PATCH', 'DELETE', 'PUT']);

const csrfCheck = (req: Request, res: Response, next: NextFunction) => {
    const allowedOrigin = process.env.FRONTEND_URL;

    if (!allowedOrigin) {
        console.warn('FRONTEND_URL 未設定，CSRF 防護無法運作');
        return next();
    }

    const method = req.method ?? '';

    if (UNSAFE_METHODS.has(method)) {
        const origin = req.headers.origin;
        const referer = req.headers.referer;

        const isOriginValid =
            (origin && origin === allowedOrigin) ||
            (referer && referer.startsWith(allowedOrigin));

        if (!isOriginValid) {
            return res.status(403).json({ error: "CSRF 驗證失敗" });
        }
    }

    next();
};

export default csrfCheck;