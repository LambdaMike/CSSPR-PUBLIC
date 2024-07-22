import { Request, Response, Router } from 'express';
import passport from "passport";
const router = Router();

// Login page
router.get('/', (req, res, next) => {
    res.render('login', { title: 'Login Page' });
});

router.post('/', passport.authenticate('local'), async (req: Request, res: Response) => {
    res.send('You were authenticated & logged in!').status(200);
    return true;
});

export default router;