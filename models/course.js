import Joi from "joi";
import mongoose from "mongoose";

export const speakerSchema = mongoose.Schema({
    fisrtName: String,
    lastName: String
})

const courseSchema = mongoose.Schema({
    name: { type: String },
    price: Number,
    tags: [String],
    startDate: { type: Date, default: Date.now() },
    numLessons: Number,
    speaker: speakerSchema,
    userId:String
})

export const CourseModel = mongoose.model("courses", courseSchema);

export const courseValidator = (_course) => {
    const courseValidationSchema = Joi.object({
        name: Joi.string().min(3).max(5).required(),
        price: Joi.number().min(0).max(10000).required(),
        speaker: Joi.object({
            firstName: Joi.string(),
            lastName: Joi.string()
        }),
        numLessons: Joi.number(),
        startDate: Joi.string(),
        tags: Joi.array()

    })
    return courseValidationSchema.validate(_course);
}