import {describe, expect, test} from '@jest/globals';

import CategoryService from '../../services/category.service';

import db from '../../database/models'

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
        const mockCategoryCreated = Category.bulkInsert(mockCategories)


        const response = await CategoryService.fetchChildCategories(parentCategory.id);
        expect(response).toEqual({ statusCode: 200, data: mockCategoryCreated });
    });

    it('should return an empty array if no child categories found', async () => {
        // Mocking the findAll method of Category model to return empty array
        const parentCategory =  await Category.create({name:"Parent Category"})

        const response = await CategoryService.fetchChildCategories(parentCategory.id);
        expect(response).toEqual({ statusCode: 200, data: [] });
    });

});