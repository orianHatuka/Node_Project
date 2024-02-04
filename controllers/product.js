import Joi from 'joi';
import { ProductModel, productValidator } from "../models/product.js";
import mongoose from 'mongoose';

export const getAllProducts = async (req, res, next) => {
    // const { number } = Joi;
    let txt = req.query.txt || undefined;
    let {name, price}=req.query;
    let page = req.query.page || 1;
    let perPage = req.query.perPage || 20;
    try {

        let allProducts = await ProductModel.find({
            // $or: [{ name }, { price }]
        }).skip((page - 1) * perPage).limit(perPage);
        res.json(allProducts)
    }
    catch (err) {
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get products" })
    }
}

// export const getAllProducts = async (req, res) => {
//     let txt = req.query.txt || undefined;
//     let page = req.query.page || 1;
//     let perPage = req.query.perPage || 20;
//     try {
//         let allProducts = await ProductModel.find({
//             $or: [{ name: txt }, { price: txt }]
//         },"-password").skip((page - 1) * perPage).limit(perPage);
//         res.json(allProducts)

//     } catch (err) {
//         res.status(400).json({ type: "invalid operation", message: "cannot sign in user" })
//     }
// }
export const getProductById = async (req, res) => {
    let { id } = req.params;
    try {
        if (!mongoose.isValidObjectId(id)) {
            res.status(400);
            throw new Error('קוד לא הגיוני')
        }
        // return res.status(400).json({ type: "not valid id", message: "id not in right format" })
        let product = await ProductModel.findById(id);
        if (!product)
            return res.status(404).json({ type: "no id", message: "no product with such id" })
        return res.json(product)
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get product" })
    }
}
// export const deleteProduct = async (req, res) => {
//     //req.user
//     let { id } = req.params;
//     try {
//         if (!mongoose.isValidObjectId(id))
//             return res.status(400).json({ type: "not valid id", message: "id not in right format" })
//         let product = await ProductModel.findById(id);
//         if (!product)
//             return res.status(404).json({ type: "no product to delete", message: "no product with such id to delete" })
//         if (req.user.role != "ADMIN" && product.userId != req.user._id)
//             res.status(403).json({ type: "not allowed", message: "you are not allowed to delete product only manager or if you added this product" })
//         product = await ProductModel.findByIdAndDelete(id)
//         return res.json(product)
//     }
//     catch (err) {
//         console.log(err)
//         res.status(400).json({ type: "invalid operation", message: "sorry cannot get product" })
//     }
// }

export const deleteProduct = async (req, res) => {
    let { id } = req.params;
    try {
        if (!mongoose.isValidObjectId(id))
            return res.status(400).json({ type: "not valid id", message: "id not in right format" })
        let product = await ProductModel.findById(id);


        if (!product)
            return res.status(404).json({ type: "no product to delete", message: "no product with such id to delete" })
        if (req.user.role != "ADMIN" && product.userId != req.user._id)
            res.status(403).json({ type: "not allowed", message: "you are not allowed to delete product only manager or if you added this product" })
        product =await ProductModel.findByIdAndDelete(id)
        return res.json(product)
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get product" })
    }
}
export const addProduct = async (req, res) => {
    let { name, price, description, manufactureDate } = req.body;
    const result = await productValidator(req.body);
    console.log(result)
    if (result.errors)
        return res.status(400).json({ type: "invalid data", message: result.errors.details[0].message })
    try {
        let sameProduct = await ProductModel.findOne({ name: name });
        if (sameProduct)
            return res.status(409).json({ type: "same details", message: "there is already same product" })
        let newProduct = new ProductModel({ name, price, description, manufactureDate, userId: req.user._id });
        await newProduct.save();
        return res.json(newProduct)
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get product" })
    }
}
export const updateProduct = async (req, res) => {

    let { id } = req.params;
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ type: "not valid id", message: "id not in right format" })
    try {
        let product = await ProductModel.findById(id);
        if (!product)
            return res.status(404).json({ type: "product not found", message: "no product with such id" })

        let updated = await ProductModel.findByIdAndUpdate(id, req.body, { new: true })
        return res.json(updated);
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get product" })
    }
}