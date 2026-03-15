import sql from '../db/db.js';
import { CreditTransfer, CreditTransferWithUser } from '../types/creditTransfer.js';

export const createCreditTransfer = async ( user_id: number, semester:string, course_type: string, credit_type: string, 
    credit: number, course_name_before: string, course_name_after: string):Promise<CreditTransfer> => {
        const result = await sql<CreditTransfer[]>`
            INSERT INTO credit_transfer (user_id, semester, course_type, credit_type, credit, course_name_before, course_name_after, receive_date)
            VALUES (${user_id}, ${semester}, ${course_type}, ${credit_type}, ${credit}, ${course_name_before}, ${course_name_after}, CURRENT_DATE)
            RETURNING *
            `;
        return result[0]!;
};

export const getCreditTransferByUserId = async (user_id: number):Promise<CreditTransfer[]> => {
    const result = await sql<CreditTransfer[]>`
        SELECT * FROM credit_transfer
        WHERE user_id = ${user_id}
        `;
        return result;
};

export const getAllCreditTransfer = async ():Promise<CreditTransferWithUser[]> => {
    const result = await sql<CreditTransferWithUser[]>`
        SELECT credit_transfer.*, users.name, users.email FROM credit_transfer
        JOIN users ON credit_transfer.user_id = users.id
        ORDER BY credit_transfer.id DESC
        `;
        return result;
};

export const updateCreditTransfer = async (id: number, credit_status: 'PENDING' | 'APPROVED' | 'REJECTED', reason: string | null): Promise<CreditTransfer | null> => {
        const result = await sql<CreditTransfer[]>`
            UPDATE credit_transfer
            SET credit_status = ${credit_status}, reason = ${reason}, completion_date = CURRENT_DATE
            WHERE id = ${id} RETURNING *
            `;
        
        return result[0] ?? null;
};