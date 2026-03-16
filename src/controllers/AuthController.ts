import { Request, Response } from 'express';
import * as authService from '../services/AuthService.js';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
    const { loginId, password, name, email } = req.body;

    if (!loginId || !password || !name || !email) {
        res.status(400).json({ error: "所有欄位都要填" });
        return;
    };

    try {
        const user = await authService.register(loginId, password, name, email);
        res.status(201).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "註冊失敗" });
    };
};

export const login = async (req: Request, res: Response) => {
    const { loginId, password } = req.body;

    if ( !loginId || !password ) {
        res.status(400).json({ error: "帳號跟密碼都要填"});
        return;
    };

    try {
        const user = await authService.login(loginId, password);

        if (!user) {
            res.status(401).json({ error: "帳號或密碼錯誤"});
            return;
        };

        const token = jwt.sign(
            { id: user.id, loginId: user.login_id, name: user.name, email: user.email, user_role: user.user_role },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 60 * 60 * 1000 
        });

        res.json({ message: "登入成功", name: user.name, email: user.email, user_role: user.user_role });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "登入失敗" });
    };
};

export const me = (req: Request, res: Response) => {
    res.json(req.user);
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('token');
    res.json({ message: "登出成功"});
};