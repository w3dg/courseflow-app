"use server";

import { db } from "@/db";
import { classes, createClassSchema } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type TeacherId = z.infer<typeof createClassSchema>["classTeacherId"];
type ClassData = Omit<z.infer<typeof createClassSchema>, "classTeacherId">;

export async function createClass(teacherId: TeacherId, values: ClassData) {
  try {
    await db.insert(classes).values({ classTeacherId: teacherId, ...values });
    revalidatePath("/dashboard");

    return { error: null };
  } catch (e) {
    return {
      error: "An error occurred while creating the class",
    };
  }
}
