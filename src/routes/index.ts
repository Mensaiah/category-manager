import { Router } from "express";
import "express-async-errors";
import categoryRoute from "./categories";
const router = Router();

router.use("/categories", categoryRoute);

export default router;
