import express from 'express';
import checkAuth from '../middleware/check-auth.js';
const router = express.Router();

import { user_signup } from '../controllers/user.js';
import { user_login } from '../controllers/user.js';
import { user_delete } from '../controllers/user.js';

router.post('/signup', user_signup);

router.post('/login', user_login);

router.delete('/:userId', checkAuth, user_delete);

export default router;
