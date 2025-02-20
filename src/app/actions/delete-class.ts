"use server";

import { db } from "@/db";
import { classes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteClass(classId: string) {
  try {
    await db.delete(classes).where(eq(classes.id, classId));
    revalidatePath("/dashboard");
    return {
      error: null,
    };
  } catch (e) {
    return {
      error: "An error occurred deleting the class",
    };
  }
}
