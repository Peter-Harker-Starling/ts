export interface CreditTransfer {
    id: number;
    user_id: number;
    semester: string;
    course_type: string;
    credit_type: string;
    credit: number;
    course_name_before: string;
    course_name_after: string;
    receive_date: string | null;
    completion_date: string | null;
    credit_status: 'PENDING' | 'APPROVED' | 'REJECTED';
    reason: string | null;
};

export interface CreditTransferWithUser extends CreditTransfer {
    name: string;
    email: string;
};