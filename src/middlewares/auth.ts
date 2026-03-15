import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
    id: number;
    loginId: string;
    name: string;
    email: string;
    user_role: 'STAFF' | 'STUDENT';
};

// 這段下面解釋
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
};

const auth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if ( !token ) {
        res.status(401).json({ error: "請先登入" });
        return;
    };

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.user = decoded;
        next();
    } catch (err) {
        res.clearCookie('token');
        res.status(401).json({ error: "登入已過期，請重新登入" });
    };
};

export default auth;

// Express 裡有個 Request 型別，裡面有 body, params, query 三個屬性
// 但沒有 user 屬性，所以我們在這裡使用 TypeScript 的 declare global 來擴展 Express 的 Request 型別，讓它包含 user 屬性
// 這樣我們在後續的程式碼中就可以直接使用 req.user 來存取解碼後的 JWT 資料