import { requireAuth } from "@/app/utils/require-auth";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { material } from "@/db/schema";
import Link from "next/link";
import { redirect } from "next/navigation";
import EditMaterialForm from "./edit-material-form";

export default async function EditMaterialPage({
  params,
}: {
  params: Promise<{ classId: string; materialId: string }>;
}) {
  const paramsData = await params;
  const classId = paramsData.classId;
  const materialId = paramsData.materialId;

  const session = await requireAuth();

  if (session.user.role !== "teacher") {
    redirect(`/dashboard/view-class/${classId}`);
  }

  const classInfo = await db.query.classes.findFirst({
    where: (classes, { eq }) => eq(classes.id, classId),
  });

  if (!classInfo) {
    return (
      <div className="flex flex-col gap-1 items-center">
        <h1 className="text-lg md:text-xl">Class not found</h1>
        <Link href={"/dashboard"}>
          <Button variant="link">Go back to dashboard</Button>
        </Link>
      </div>
    );
  }

  const materialData = await db.query.material.findFirst({
    where: (material, { eq }) => eq(material.id, materialId),
  });

  if (!materialData) {
    return (
      <div className="flex flex-col gap-1 items-center">
        <h1 className="text-lg md:text-xl">Material not found</h1>
        <Link href={`/dashboard/manage/${classId}`}>
          <Button variant="link">Go back to class overview</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="flex flex-col gap-8 mt-8">
        <h1 className="font-bold text-xl md:text-2xl">Edit Material</h1>
        <div className="flex gap-2 items-center">
          <Link href={`/dashboard/manage/${classId}`}>
            <Button variant={"outline"}>Back to class overview</Button>
          </Link>
        </div>
        <div>
          <EditMaterialForm classId={classId} materialId={materialId} initialData={materialData} />
        </div>
      </section>
    </>
  );
}
