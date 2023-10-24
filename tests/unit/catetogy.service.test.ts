import {describe, expect, test} from '@jest/globals';

import CategoryService from '../../src/services/category.service';

import db from '../../src/database/models'

const {Category} = db

describe('addCategory', () => {
    beforeEach(() => {
        Category.destroy({where: {}})
    });

    it('should return validation error if name is missing', async () => {
        const response = await CategoryService.addCategory({ parentId: 1 });
        expect(response).toEqual({ error: "name is required", statusCode: 422 });
    });

    it('should return an error if parent category is not found', async () => {
        const response = await CategoryService.addCategory({ name: 'Child Category', parentId: 2 });
        expect(response).toEqual({ error: "The Parent Category specified cannot be found", statusCode: 404 });
    });

    it('should add a new category successfully', async () => {
        const mockCategory = {
            name: 'New Category',
            parentId: undefined
        };
        const response = await CategoryService.addCategory(mockCategory);
        expect(response.statusCode).toBe(201);
        expect(response.data.name).toBe(mockCategory.name);

        const createdCategory = await Category.findByPk(response.data.id)
        expect(createdCategory.name).toBe(response.data.name);
        
    });
});


describe('fetchChildCategories', () => {
    beforeEach(() => {
        Category.destroy({where: {}})

    });

    it('should return validation error if parentId is invalid', async () => {
        const response = await CategoryService.fetchChildCategories("invalid-id");
        expect(response).toEqual({ error: "id must be a number", statusCode: 422 });
    });

    it('should return child categories for a valid parentId', async () => {
  
       const parentCategory =  await Category.create({name:"Parent Category"})
        const mockCategories = [
            {  name: 'Child Category 1', parentId: parentCategory.id },
            {  name: 'Child Category 2', parentId: parentCategory.id }
        ];
await Category.bulkCreate(mockCategories)


        const response = await CategoryService.fetchChildCategories(parentCategory.id);
        expect(response.statusCode).toEqual(200)
        expect(response.data.length).toEqual(2);
        expect(response.data[0]?.name).toEqual(mockCategories[0].name);
        expect(response.data[1]?.name).toEqual(mockCategories[1].name);
    });

    it('should return an empty array if no child categories found', async () => {
        // Mocking the findAll method of Category model to return empty array
        const parentCategory =  await Category.create({name:"Parent Category"})

        const response = await CategoryService.fetchChildCategories(parentCategory.id);
        expect(response).toEqual({ statusCode: 200, data: [] });
    });

});

describe('removeCategory', () => {
    beforeEach(() => {
        Category.destroy({where: {}})
    });

    it('should return validation error for invalid category id', async () => {
        const mockId = "invalid-id";
        const response = await CategoryService.removeCategory(mockId);
        expect(response).toEqual({ error: "id must be a number", statusCode: 422 });
    });

    it('should return error if category is not found', async () => {
        const mockId = "1";


        const response = await CategoryService.removeCategory(mockId);
        expect(response).toEqual({ error: "The Category specified cannot be found", statusCode: 404 });
    });

    it('should return error if category has children', async () => {
      const parentCategory = await  Category.create({ name: 'Parent Category' });

       const mockCategories = [
        {  name: 'Child Category 1', parentId: parentCategory.id },
        {  name: 'Child Category 2', parentId: parentCategory.id }
    ];
        await Category.bulkCreate(mockCategories)


        const response = await CategoryService.removeCategory(parentCategory.id);
        expect(response).toEqual({ error: "Category has children and cannot be deleted", statusCode: 400 });
    });

    it('should delete the category if it has no children', async () => {

       const category = await Category.create({ name: 'Parent Category' });

        const response = await CategoryService.removeCategory(category.id);
        expect(response).toEqual({ data: "Category has been removed successfully", statusCode: 204 });

       const deleteCategory = await Category.findByPk(category.id);
       expect(deleteCategory).toEqual(null);

    });

});



describe('moveCategoryChild', () => {
    beforeEach(() => {
        Category.destroy({where: {}})
    });

    it('should return validation error for invalid category id', async () => {
        const mockId = "invalid-id";
        const mockInput = { newParentId: "2" };

        const response = await CategoryService.moveCategoryChild(mockId, mockInput);
        expect(response).toEqual({ error: "id must be a number", statusCode: 422 });
    });

    it('should return error if category is not found', async () => {
        const mockId = "1";
        const mockInput = { newParentId: "2" };

        const response = await CategoryService.moveCategoryChild(mockId, mockInput);
        expect(response).toEqual({ error: "The Category specified cannot be found", statusCode: 404 });
    });

    it('should return error if category is already a child of the specified parent', async () => {
        const parentCategory = await Category.create({name:"Parent Category"})
        const childCategory = await Category.create({name:"Child Category",parentId: parentCategory.id})
        const mockInput = { newParentId: parentCategory.id };
      

        const response = await CategoryService.moveCategoryChild(childCategory.id, mockInput);
        expect(response).toEqual({ error: "This Category is already a child of the specified parent", statusCode: 400 });
    });

    it('should return error if new parent category is not found', async () => {
        const mockInput = { newParentId: "2" };
        const childCategory = await Category.create({name:"Child Category"})
        const parentCategory = await Category.create({name:"Parent Category "})


        const response = await CategoryService.moveCategoryChild(childCategory.id, mockInput);
        expect(response).toEqual({ error: "The Parent Category specified cannot be found", statusCode: 404 });
    });

    it('should successfully update the category parent', async () => {
        const parentCategoryOne = await Category.create({ name: "Parent Category One" });
        const parentCategoryTwo = await Category.create({ name: "Parent Category Two" });
        const childCategory = await Category.create({name:"Child Category", parentId: parentCategoryOne.id })
        const mockInput = { newParentId: parentCategoryTwo.id };


        const response = await CategoryService.moveCategoryChild(childCategory.id, mockInput);
        expect(response.statusCode).toEqual(200);
        expect(response.data.id).toEqual(childCategory.id);
        expect(response.data.name).toEqual(childCategory.name);
        expect(response.data.parentId).toEqual(parentCategoryTwo.id);


        const updatedChildCategory = await Category.findByPk(childCategory.id);
        expect(updatedChildCategory.id).toEqual(childCategory.id);
        expect(updatedChildCategory.name).toEqual(childCategory.name);
        expect(updatedChildCategory.parentId).toEqual(parentCategoryTwo.id);

        });
    });
