"use server";

import { db } from "@/db";
import { enrollments, joinClassSchema } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type StudentId = z.infer<typeof joinClassSchema>["userId"];
type ClassData = Omit<z.infer<typeof joinClassSchema>, "userId">;

export async function createEnrollment(studentId: StudentId, values: ClassData) {
  try {
    await db.insert(enrollments).values({ userId: studentId, ...values });
    revalidatePath("/dashboard");

    return { error: null };
  } catch (e) {
    return {
      error: "An error occurred joining the class",
    };
  }
}
