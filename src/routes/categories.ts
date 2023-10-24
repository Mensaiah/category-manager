import { Router } from "express";

import "express-async-errors";
import CategoryController from "../controllers/category.controller";
const router = Router();

router.post("/", CategoryController.addCategory)
router.get("/subtree/:parentId", CategoryController.fetchChildCategories)
router.put("/move/:id", CategoryController.moveCategoryChild)
router.delete("/:id", CategoryController.removeCategory)

export default router;
