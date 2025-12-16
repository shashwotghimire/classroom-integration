import { z } from "zod";

export const createCourseSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Course name is required"),
    section: z.string().min(1, "Course section is required"),
    room: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const updateCourseSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    section: z.string().optional(),
    room: z.string().optional(),
    description: z.string().optional(),
  }),
});
