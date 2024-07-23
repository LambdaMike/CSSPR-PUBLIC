import { Router } from 'express';
import { create } from '../../../controllers/admin';

const router = Router();

router.post('/', create);

export default router;