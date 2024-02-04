//require -נקרא commonJS modules\
//import es6 modules

import express from "express";
import courseRouter from "./routes/course.js"
import userRouter from "./routes/user.js"
import ordersRouter from "./routes/orders.js"
import productRouter from "./routes/product.js"
import { connectToDB } from "./db/connectToDb.js"
import { config } from "dotenv";
import cors from "cors";
import { errorHandling } from "./middlwares/errorHandling.js";

const printDate = (req, res, next) => {
    console.log("a new request in", Date.now())
    next()
}

const app = express();
app.use(cors())
app.use(express.json());

connectToDB();
config();

app.use("api/all", express.static("files"))
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/orders", ordersRouter);

app.use(errorHandling)

let port = process.env.PORT || 3500;
app.listen(port, () => {
    console.log(`app is listening on port ${port}`)
})
   // / api / all / picture2.jpg