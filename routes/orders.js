import express from "express";
import { addOrders, getAllOrders, getOrdersById, deleteOrders, updateOrders, getAllOrdersByUser} from "../controllers/orders.js";
import { auth,authAdmin } from "../middlwares/auth.js";

const router = express.Router();

router.get("/", authAdmin,getAllOrders);
router.get("/:id", getOrdersById);
router.get("/:id",getAllOrdersByUser)
router.delete("/:id", auth, deleteOrders);
router.post("/", auth, addOrders);
router.put("/:id", authAdmin,updateOrders);
export default router;