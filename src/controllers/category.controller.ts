
import { Request, Response } from "express";
import CategoryService from "../services/category.service";
export default class CategoryController {
    public static async addCategory(req: Request, res: Response) {

        const { error, statusCode, data } = await CategoryService.addCategory(req.body)
        if (error) {
            return res.status(statusCode).json({ error })
        }
        return res.status(statusCode).json({ data })
    }
    public static async removeCategory(req: Request, res: Response) {
        const { error, statusCode, data } = await CategoryService.removeCategory(req.params.id)
        if (error) {
            return res.status(statusCode).json({ error })
        }
        return res.status(statusCode).json({ data })
    }
    public static async fetchChildCategories(req: Request, res: Response) {
        const { error, statusCode, data } = await CategoryService.fetchChildCategories(req.params.parentId)
        if (error) {
            return res.status(statusCode).json({ error })
        }
        return res.status(statusCode).json({ data })
    }
    public static async moveCategoryChild(req: Request, res: Response) {
        const { error, statusCode, data } = await CategoryService.moveCategoryChild(req.params.id, req.body)
        if (error) {
            return res.status(statusCode).json({ error })
        }
        return res.status(statusCode).json({ data })
    }
}