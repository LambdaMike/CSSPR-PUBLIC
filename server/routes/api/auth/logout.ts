import { Request, Response, NextFunction, Router } from 'express';
const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.clearCookie('connect.sid');

        res.redirect('/api/auth/login'); // Redirect to login page or home page after logout
    });
});

export default router;