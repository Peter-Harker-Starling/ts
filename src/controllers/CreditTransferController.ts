import { Request, Response } from 'express';
import * as creditTransferService from '../services/CreditTransferService.js';

export const createCreditTransfer = async (req: Request, res: Response) => {
    const user_id = req.user!.id;
    const { semester, course_type, credit_type, credit, course_name_before, course_name_after } = req.body;

    if ( !semester || !course_type || !credit_type || !credit || !course_name_before || !course_name_after ) {
        res.status(400).json({ error: "所有欄位都要填"});
        return;
    };

    try {
        const result = await creditTransferService.createCreditTransfer(user_id, semester, course_type, credit_type, credit, course_name_before, course_name_after);
        res.status(201).json(result);
    } catch ( error ) {
        console.log(error);
        res.status(500).json({ error: "申請失敗"});
    };
};

export const getMyCreditTransfer = async (req: Request, res: Response) => {
    const user_id = req.user!.id;

    try {
        const result = await creditTransferService.getCreditTransferByUserId(user_id);

        if (result.length === 0) {
            res.status(404).json({ error: "沒有申請紀錄" });
            return;
        };

        res.json(result);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "查詢失敗"});
    };
};

export const getAllCreditTransfer = async (req: Request, res: Response) => {
    try {
        const result = await creditTransferService.getAllCreditTransfer();
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "查詢失敗"});
    };
};

export const updateCreditTransfer = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { credit_status, reason } = req.body;

    if ( !credit_status || (credit_status !== 'PENDING' && credit_status !== 'APPROVED' && credit_status !== 'REJECTED')) {
        res.status(400).json({ error: "credit_status 欄位要填，且只能是 PENDING、APPROVED、REJECTED" });
        return;
    };

    try {
        const result = await creditTransferService.updateCreditTransfer(Number(id), credit_status, reason || null);

        if (!result) {
            res.status(404).json({ error: "申請紀錄不存在"});
            return;
        };

        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "更新失敗"});
    };
};