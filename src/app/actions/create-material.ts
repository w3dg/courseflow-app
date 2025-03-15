"use server";

import { db } from "@/db";
import { material, CreateMaterialSchema } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type ClassId = z.infer<typeof CreateMaterialSchema>["classId"];
type MaterialData = Omit<z.infer<typeof CreateMaterialSchema>, "classId">;

export async function createMaterial(classId: ClassId, values: MaterialData) {
  try {
    await db.insert(material).values({
      classId: classId,
      ...values,
    });

    revalidatePath(`/dashboard/manage/${classId}/materials`);
    return { error: null };
  } catch (e) {
    return {
      error: "An error occurred while creating the material",
    };
  }
}
