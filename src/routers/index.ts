import { Router } from "express";
import authRouter from "./authRouter.js";
import filterRouter from "./filterRouter.js";

const router = Router();

router.use(authRouter);
router.use(filterRouter);

export default router