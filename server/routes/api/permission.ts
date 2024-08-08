import { Router } from 'express';
import { create, remove, findAll, findOne } from "../../controllers/permission";

const router = Router();

router.post('/', create);
router.get('/', findAll);
router.get('/:id', findOne);
router.delete('/:id', remove);

export default router;