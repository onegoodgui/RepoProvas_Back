import { Router } from "express";
import authRouter from "./authRouter.js";
import filterRouter from "./filterRouter.js";
import testRouter from "./testRouter.js";

const router = Router();

router.use(authRouter);
router.use(filterRouter);
router.use(testRouter);

export default router