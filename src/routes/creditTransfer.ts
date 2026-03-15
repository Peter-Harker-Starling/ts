import { Router } from "express";
import * as creditTransferController from '../controllers/CreditTransferController.js';
import auth from '../middlewares/auth.js';
import staffOnly from "../middlewares/StaffOnly.js";

const router = Router();

router.post('/', auth, creditTransferController.createCreditTransfer);
router.get('/my', auth, creditTransferController.getMyCreditTransfer);
router.get('/all', auth, staffOnly, creditTransferController.getAllCreditTransfer);
router.patch('/:id', auth, staffOnly, creditTransferController.updateCreditTransfer);

export default router;