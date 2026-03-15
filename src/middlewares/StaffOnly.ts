import { Request, Response, NextFunction } from 'express';

const staffOnly = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.user_role !== 'STAFF') {
        res.status(403).json({ error: "權限不足" });
        return;
    };
    next();
};

export default staffOnly;