import mongoose from "mongoose";
import { speakerSchema } from "./course.js";
import jwt from "jsonwebtoken";

const minimalCourseSchema = mongoose.Schema({
    name: String,
    price: Number,
    speaker: speakerSchema
})

const userSchema = mongoose.Schema({

    userName: String,
    password: String,
    email: { type: String, unique: true },
    courses: [minimalCourseSchema],
    role: { type: String, default: "USER" }
})

export const userModel = mongoose.model("users", userSchema)

export const generateToken = (_id, role, userName) => {

    let token = jwt.sign({ _id, userName, role }, process.env.SECRET_JWT, {
        expiresIn: "1h"
    });
    return token;

}