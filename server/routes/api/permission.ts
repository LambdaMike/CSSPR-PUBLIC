import { Router } from 'express';
import { create, remove, findAll } from "../../controllers/permission";

const router = Router();

router.post('/', create);
router.get('/', findAll);
router.delete('/:id', remove);

export default router;