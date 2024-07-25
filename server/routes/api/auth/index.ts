import { isAuthenticated } from "../../../middleware/passport";
import { Router } from 'express';

import login from './login';
import signup from './signup';
import logout from "./logout";
import check from "./check";

const router = Router();

router.use('/login', login);
router.use('/signup', signup);
router.use('/logout', isAuthenticated, logout);
router.use('/check', isAuthenticated, check);

export default router;