import { RequestHandler, Router } from "express";
import {
  listCourses,
  createCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createCourseSchema,
  updateCourseSchema,
} from "../validation/course.validation";

const router = Router();
router.use(authMiddleware);
router.get("/classroom/courses", listCourses);
router.get("/classroom/courses/:courseId", getCourseById);
router.delete("/classroom/courses/:courseId", deleteCourse);
router.put(
  "/classroom/courses/:courseId",
  validate(updateCourseSchema),
  updateCourse
);
router.post("/classroom/courses", validate(createCourseSchema), createCourse);
router.post("/classroom/courses", validate(createCourseSchema), createCourse);

export default router;
