import Joi from 'joi'



export default class CategoryValidator {
    public static addCategoryValidation(payload: Record<string, string | number>) {
        const schema = Joi.object({
            name: Joi.string().required(),
            parentId: Joi.number().min(1)
        })
        const { error } = schema.validate(payload,  {
            abortEarly: true
        });

        return error?.details[0].message.replace(/['"]/g, "")
     }

     public static validateCategoryId(id: string) {
        const schema = Joi.object({
            id: Joi.number().min(1)
        })
        const { error } = schema.validate({id},  {
            abortEarly: true
        });

        return error?.details[0].message.replace(/['"]/g, "")
     }
       public static   moveCategoryChildValidation(payload: Record<string, string| number>) {
        const schema = Joi.object({
            newParentId: Joi.number().min(1)
        })
        const { error } = schema.validate(payload,  {
            abortEarly: true
        });

        return error?.details[0].message.replace(/['"]/g, "")
   
       }
}