import express from "express";
import { addCourse, getAllCourses, getCourseById, deleteCourse, updateCourse } from "../controllers/course.js";
import { auth } from "../middlwares/auth.js";

const router = express.Router();

router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.delete("/:id", auth, deleteCourse);
router.post("/", auth, addCourse);
router.put("/:id", updateCourse);

export default router;