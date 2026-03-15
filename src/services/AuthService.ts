import sql from '../db/db.js';
import { User } from '../types/user.js';
import bcrypt from 'bcrypt';

export const register = async (loginId: string, password: string, name: string, email: string):Promise<User> => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await sql<User[]>`
        INSERT INTO users (login_id, password, name, email)
        VALUES (${loginId}, ${hashedPassword}, ${name}, ${email})
        RETURNING id, login_id, name, email
    `;
    return result[0]!;
};

export const login = async (loginId: string, password: string):Promise<User | null> => {
    const result = await sql<User[]>`
        SELECT * FROM users WHERE login_id = ${loginId}
        `;
    const user = result[0];

    if (!user) {
        return null;
    };

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return null;
    };

    return user;
};