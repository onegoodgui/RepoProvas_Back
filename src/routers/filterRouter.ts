import { Router } from "express";
import { filterSearch } from "../controllers/filterController.js";
import { validateToken } from "../middlewares/validateTokenMiddleware.js";

const filterRouter = Router();

filterRouter.get('/filter/:filterType', validateToken, filterSearch)

export default filterRouter