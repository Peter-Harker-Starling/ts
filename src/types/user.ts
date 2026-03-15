export interface User {
    id: number;
    login_id: string;
    password: string;
    name: string;
    email: string;
    user_role: 'STAFF' | 'STUDENT';
};