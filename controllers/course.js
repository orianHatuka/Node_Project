import mongoose from "mongoose";
import { CourseModel, courseValidator } from "../models/course.js"

//params חובה /api/course/1
//queryparams אופציונלים /api/course?txt=a




export const getAllCourses = async (req, res, next) => {

    let txt = req.query.txt || undefined;
    let page = req.query.page || 1;
    let perPage = req.query.perPage || 30;

    // if(req.xxx)
    try {

        let allCourses = await CourseModel.find({
            $or:
                [{ name: txt }, { "speaker.firstName": txt }]
        }).skip((page - 1) * perPage).limit(perPage);
        //pagination
        res.json(allCourses)

    }
    catch (err) {
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get courses" })
    }
}



export const getCourseById = async (req, res) => {
    let { id } = req.params;
    try {
        if (!mongoose.isValidObjectId(id)) {
            res.status(400);
            throw new Error('קוד לא הגיוני')
        }
        // return res.status(400).json({ type: "not valid id", message: "id not in right format" })
        let course = await CourseModel.findById(id);
        if (!course)
            return res.status(404).json({ type: "no id", message: "no course with such id" })
        return res.json(course)

    }
    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get course" })
    }

}


export const deleteCourse = async (req, res) => {
    //req.user
    let { id } = req.params;
    try {
        if (!mongoose.isValidObjectId(id))
            return res.status(400).json({ type: "not valid id", message: "id not in right format" })
        let course = await CourseModel.findById(id);


        if (!course)
            return res.status(404).json({ type: "no course to delete", message: "no course with such id to delete" })
        if (req.user.role != "ADMIN" && course.userId != req.user._id)
            res.status(403).json({ type: "not allowed", message: "you are not allowed to delete course only manager or if you added this course" })
        course =await CourseModel.findByIdAndDelete(id)
        return res.json(course)
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get course" })
    }

}

export const addCourse = async (req, res) => {
    let { name, numLessons, startDate, tags, speaker, price } = req.body;

    const result = await courseValidator(req.body);
    console.log(result)
    if (result.errors)
        return res.status(400).json({ type: "invalid data", message: result.errors.details[0].message })
    try {
        let sameCourse = await CourseModel.findOne({ name: name });
        if (sameCourse)
            return res.status(409).json({ type: "same details", message: "there is already same course" })
        let newCourse = new CourseModel({ name, numLessons, startDate, tags, speaker, price, userId: req.user._id });
        await newCourse.save();

        return res.json(newCourse)

    }
    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get course" })
    }

}


export const updateCourse = async (req, res) => {

    let { id } = req.params;
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ type: "not valid id", message: "id not in right format" })
    try {
        let course = await CourseModel.findById(id);
        if (!course)
            return res.status(404).json({ type: "course not found", message: "no course with such id" })
        // let { name, numLessons, startDate, tags, speaker, price } = req.body;

        // course.name = name || course.name;
        // course.price = price || course.price;
        // course.speaker = speaker || course.speaker;
        // course.numLessons = numLessons || course.numLessons;
        // course.startDate = startDate || course.startDate;
        // course.tags = tags || course.tags;

        // await course.save();

        let updated = await CourseModel.findByIdAndUpdate(id, req.body, { new: true })

        return res.json(updated);

    }
    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get course" })
    }

}