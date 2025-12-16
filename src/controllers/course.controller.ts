import { Request, Response, RequestHandler, NextFunction } from "express";
import { getClassroomClient } from "../integrations/classroom.client";
import { Auth, classroom_v1 } from "googleapis";
import { AuthRequest } from "../middleware/auth.middleware";

export const listCourses: RequestHandler = async (
  req,
  res,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;
    const userId = user.id;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const classroom = await getClassroomClient(userId);

    const response: classroom_v1.Schema$ListCoursesResponse = (
      await classroom.courses.list({ pageSize: 20, courseStates: ["ACTIVE"] })
    ).data;

    return res.status(200).json({
      success: true,
      message: "Fetched course list successfully",
      data: {
        courses: response.courses ?? [],
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const createCourse: RequestHandler = async (
  req,
  res,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;
    const userId = user.id;
    const { name, section, room, description } = req.body;
    const classroom = await getClassroomClient(userId);
    const { data: course }: { data: classroom_v1.Schema$Course } =
      await classroom.courses.create({
        requestBody: {
          name,
          section,
          room,
          description,
          ownerId: "me",
          courseState: "PROVISIONED",
        },
      });

    return res.status(201).json({
      success: true,
      message: "Created course successfully",
      data: { course },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const getCourseById: RequestHandler = async (
  req,
  res,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Failed to fetch course",
        error: "Course id is required",
      });
    }
    const { user } = req as AuthRequest;
    const userId = user.id;
    const classroom = await getClassroomClient(userId);
    const { data: course } = await classroom.courses.get({ id: courseId });
    return res.status(200).json({
      success: true,
      message: "Fetched course successfully",
      data: { course },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const updateCourse: RequestHandler = async (
  req,
  res,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;
    const userId = user.id;
    const { courseId } = req.params;
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Failed to fetch course",
        error: "Course id is required",
      });
    }
    const { name, section, room, description } = req.body;
    const requestBody: any = {};
    const updateFields: string[] = [];

    if (name) {
      requestBody.name = name;
      updateFields.push("name");
    }
    if (section) {
      requestBody.section = section;
      updateFields.push("section");
    }
    if (room) {
      requestBody.room = room;
      updateFields.push("room");
    }
    if (description) {
      requestBody.description = description;
      updateFields.push("description");
    }

    const updateMask = updateFields.join(",");

    const classroom = await getClassroomClient(userId);
    const { data: course } = await classroom.courses.patch({
      id: courseId,
      requestBody: { name, section, room, description },
      updateMask,
    });
    return res.status(200).json({
      succes: true,
      message: "Updated course successfully",
      data: { course },
    });
  } catch (e) {
    next(e);
  }
};

export const deleteCourse: RequestHandler = async (
  req,
  res,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;
    const userId = user.id;
    const { courseId } = req.params;
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Failed to delete course",
        error: "Course id required",
      });
    }
    const classroom = await getClassroomClient(userId);
    await classroom.courses.delete({ id: courseId });
    return res.status(200).json({
      success: true,
      message: `Course ${courseId} deleted successfully`,
      data: [],
    });
  } catch (e) {
    next(e);
  }
};
