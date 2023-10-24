
import db from "../database/models";
import CategoryValidator from "../validator/category.validator";


const { Category } = db;

export default class CategoryService {
    public static async addCategory(input: { name?: string, parentId?: number }) {
        const validationError = CategoryValidator.addCategoryValidation(input);
        if (validationError) {
            return { error: validationError, statusCode: 422 }
        };
        if (input.parentId) {
            const parentIdIsValid = await Category.findByPk(input.parentId);
            if (!parentIdIsValid) {
                return { error: "The Parent Category specified cannot be found", statusCode: 404 }
            }
        };

        const newCategory = await Category.create({
            name: input.name,
            parentId: input.parentId
        })
        return { statusCode: 201, data: newCategory }
    }
    public static async removeCategory(id: string) {
        const validationError = CategoryValidator.validateCategoryId(id);
        if (validationError) {
            return { error: validationError, statusCode: 422 }
        };
        
        const categoryIsValid = await Category.findByPk(id);

        if (!categoryIsValid) {
            return { error: "The Category specified cannot be found", statusCode: 404 }
        }

        const childCount = await Category.count({ where: { parentId: id } });
        
        if (childCount > 0) {
            return { error: "Category has children and cannot be deleted", statusCode: 400 }
        }

        await Category.destroy({ where: { id } });
        return { data: "Category has been removed successfuly", statusCode: 204 }

    }
    public static async fetchChildCategories(parentId: string) {
        const validationError = CategoryValidator.validateCategoryId(parentId);
        if (validationError) {
            return { error: validationError, statusCode: 422 }
        };
        const children = await Category.findAll({ where: { parentId } });

        return {  statusCode: 200, data: children }

    }
    public static async moveCategoryChild(id: string, input: { newParentId: string }) {
        const validationError = CategoryValidator.validateCategoryId(id);
        if (validationError) {
            return { error: validationError, statusCode: 422 }
        };

        const categoryIsValid = await Category.findByPk(id);
        if (!categoryIsValid) {
            return { error: "The Category specified cannot be found", statusCode: 404 }
        }

        if (categoryIsValid.parentId === Number(input.newParentId)) {
            return { error: "This Category is already a child of the specified parent", statusCode: 400 }
            
        }

        const parentIdIsValid = await Category.findByPk(input.newParentId);
        if (!parentIdIsValid) {
            return { error: "The Parent Category specified cannot be found", statusCode: 404 }
        }
        await Category.update({ parentId: input.newParentId }, { where: { id } });

        const category = await Category.findByPk(id)
        return { statusCode: 200, data: category }
    }
}