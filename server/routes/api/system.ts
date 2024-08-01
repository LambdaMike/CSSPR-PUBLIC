import { Router } from 'express';
import { findOne, findAll } from "../../controllers/system";

const router = Router();

router.get('/:id', findOne);
router.get('/', findAll);

export default router;