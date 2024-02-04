// import { number } from "joi";
import { OrdersModel, orderValidator } from "../models/orders.js";
export const getAllOrders = async (req, res, next) => {
    let txt = req.query.txt || undefined;
    let page = req.query.page || 1;
    let perPage = req.query.perPage || 10;

    try {

        let allOrders = await OrdersModel.find({})
        // if (!allOrders)
        //     return res.status(404).json({ type: "no order", message: "No such order exists" })
        // if (allOrders.userId != req.user._id)
        //     return res.status(403).json({ type: "Not authorized", massage: "Permission is required to perform the operation" })
        return res.json(allOrders)

    }
    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get orders" })
    }
}

// export const getAllOrders = async (req, res, next) => {
//     let txt = req.query.txt || undefined;
//     let page = req.query.page || 1;
//     let perPage = req.query.perPage || 10;

//     try {
//         let allOrders = await OrdersModel.find({
//             $or:
//                 [{orders:orderDate}, {dueDate:Date}]
//         }).skip((page - 1) * perPage).limit(perPage);
       
//         res.json(allOrders)
//     }
//     catch (err) {
//         res.status(400).json({ type: "invalid operation", message: "sorry cannot get orders" })
//     }
// }

export const getOrdersById = async (req, res) => {
    let { id } = req.params;
    try {
        if (!mongoose.isValidObjectId(id)) {
            res.status(400);
            throw new Error('קוד לא הגיוני')
        }
        // return res.status(400).json({ type: "not valid id", message: "id not in right format" })
        let orders = await OrdersModel.findById(id);
        if (!orders)
            return res.status(404).json({ type: "no id", message: "no orders with such id" })
        return res.json(orders)
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get orders" })
    }
}

export const deleteOrders = async (req, res) => {
    //req.user
    let { id } = req.params;
    try {
        if (!mongoose.isValidObjectId(id))
            return res.status(400).json({ type: "not valid id", message: "id not in right format" })
        let orders = await OrdersModel.findById(id);
        if (!orders)
            return res.status(404).json({ type: "no orders to delete", message: "no orders with such id to delete" })
        // if (req.user.role != "ADMIN" && orders.userId != req.user._id)
        //     res.status(403).json({ type: "not allowed", message: "you are not allowed to delete orders only manager or if you added this orders" })
        orders = await OrdersModel.findByIdAndDelete(id)
        return res.json(orders)
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get orders" })
    }
}
// orderDate: { type: Date, default: Date.now() },
// dueDate: { type: Date },
// address: String,
// customerId: Number,
// products: [productSchema],
// orderStarted: { type: Boolean, default: false }
// })
export const addOrders = async (req, res) => {
    let { orderDate, dueDate, address, customerId, products, orderStarted} = req.body;
    const result = await orderValidator(req.body);
    console.log(result)
    if (result.errors)
        return res.status(400).json({ type: "invalid data", message: result.errors.details[0].message })
    try {
        let sameOrders = await OrdersModel.findOne({ name: name });
        if (sameOrders)
            return res.status(409).json({ type: "same details", message: "there is already same orders" })
        let newOrders = new OrdersModel({orderDate, dueDate, address, customerId, products, orderStarted, userId: req.user._id });
        await newOrders.save();
        return res.json(newOrders)
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get orders" })
    }
}

export const updateOrders = async (req, res) => {
    let { id } = req.params;
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ type: "not valid id", message: "id not in right format" })
    try {
        let orders = await OrdersModel.findById(id);
        if (!orders)
            return res.status(404).json({ type: "orders not found", message: "no orders with such id" })

        let updated = await OrdersModel.findByIdAndUpdate(id, req.body, { new: true })
        return res.json(updated);
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get orders" })
    }
}
export const getAllOrdersByUser = async (req, res) => {
    try {

        let allOrders = await OrderModel.find({userId:req.user._id} )
        res.json(allOrders)

    }
    catch (err) {
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get  all Orders" })
    }}