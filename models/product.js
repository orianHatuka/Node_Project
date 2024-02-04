import mongoose from "mongoose";
import Joi from "joi";
export const productSchema=mongoose.Schema({
    name: String ,
    price: Number,
    description :String ,
    manufactureDate:{ type: Date, default: Date.now() },
    role: { type: String, default: "USER" }
})
export const ProductModel = mongoose.model("products", productSchema)

export const productValidator = (_product) => {
    const productValidationSchema = Joi.object({
        name: Joi.string().min(3).max(15).required(),
        price: Joi.number().min(0).max(10000).required(),
        // manufactureDate: Joi.string()
    })
    return productValidationSchema.validate(_product);
}