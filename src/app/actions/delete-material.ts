"use server";

import { db } from "@/db";
import { material } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteMaterial(materialId: string, classId: string) {
  try {
    await db.delete(material).where(eq(material.id, materialId));
    revalidatePath(`/dashboard/manage/${classId}/materials`);
    return {
      error: null,
    };
  } catch (e) {
    return {
      error: "An error occurred deleting the class",
    };
  }
}
