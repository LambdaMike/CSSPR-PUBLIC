import { Request, Response, Router } from 'express';
import passport from "passport";
const router = Router();

router.post('/', passport.authenticate('local'), async (req: Request, res: Response) => {
    res.json({ message: "Login successful" }).status(200);
    return true;
});

export default router;