import { Router } from "express";
import * as creditTransferController from '../controllers/CreditTransferController.js';
import auth from '../middlewares/auth.js';
import staffOnly from "../middlewares/StaffOnly.js";
import csrfCheck from "../middlewares/csrf.js";

const router = Router();

router.post('/', auth, csrfCheck, creditTransferController.createCreditTransfer);
router.get('/my', auth, creditTransferController.getMyCreditTransfer);
router.get('/all', auth, staffOnly, creditTransferController.getAllCreditTransfer);
router.patch('/:id', auth, staffOnly, csrfCheck, creditTransferController.updateCreditTransfer);

export default router;