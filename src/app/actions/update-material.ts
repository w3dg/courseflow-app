"use server";

import { db } from "@/db";
import { material, EditMaterialSchema } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type EditMaterialValues = z.infer<typeof EditMaterialSchema>;

export async function updateMaterial(classId: string, materialId: string, values: EditMaterialValues) {
  try {
    await db
      .update(material)
      .set({
        title: values.title,
        content: values.content,
      })
      .where(and(eq(material.id, materialId), eq(material.classId, classId)));

    revalidatePath(`/dashboard/manage/${classId}/materials`);
    return { error: null };
  } catch (e) {
    return {
      error: "An error occurred while updating the material",
    };
  }
}
