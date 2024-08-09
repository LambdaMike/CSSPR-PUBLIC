import { Router } from 'express';
import { create, remove, findAll, findOne } from "../../controllers/permission";

const router = Router();

router.get('/', findAll);
router.get('/:id', findOne);
router.post('/', create);
router.delete('/:id', remove);

export default router;