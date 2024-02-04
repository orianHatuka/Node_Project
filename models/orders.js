import Joi from "joi";
import {productSchema} from "./product.js"
import mongoose from "mongoose";
export const ordersSchema = mongoose.Schema({
    orderDate: { type: Date, default: Date.now() },
    dueDate: { type: Date },
    address: String,
    customerId: Number,
    products: [productSchema],
    orderStarted: { type: Boolean, default: false }
})
export const OrdersModel = mongoose.model("orders", ordersSchema)

export const orderValidator = (_order) => {
    const orderValidationSchema = Joi.object({
        address: Joi.string().required,
        orderDate: Joi.string(),
        products:Joi.array()
    })
    return orderValidationSchema.validate(_order);
}