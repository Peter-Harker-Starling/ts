import { Router } from 'express';
import * as authController from '../controllers/AuthController.js';
import auth from '../middlewares/auth.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.me);
router.post('/logout', authController.logout);

export default router;