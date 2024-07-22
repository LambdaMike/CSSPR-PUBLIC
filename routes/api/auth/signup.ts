import { Router } from 'express';
import { create } from '../../../controllers/admin';

const router = Router();

// Login page

router.get('/', (req, res, next) => {
    res.render('signup', { title: 'Signup Page' });
  });

router.post('/', create);

export default router;