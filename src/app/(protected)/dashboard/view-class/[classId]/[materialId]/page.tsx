import { requireAuth } from "@/app/utils/require-auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { StarsIcon } from "lucide-react";
import Link from "next/link";
import MCQView from "./MCQView";

export default async function ViewMaterialPage({
  params,
}: {
  params: Promise<{ classId: string; materialId: string }>;
}) {
  const paramsData = await params;
  const classId = paramsData.classId;
  const materialId = paramsData.materialId;

  const session = await requireAuth();

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
        <div className="flex gap-2 items-center">
          <div>
            <Link href={`/dashboard/manage/${classId}`}>
              <Button variant={"outline"}>Back to class overview</Button>
            </Link>
            {session.user.role === "teacher" && (
              <Link href={`/dashboard/manage/${classId}/materials/edit/${materialId}`}>
                <Button variant={"outline"}>Edit Material</Button>
              </Link>
            )}
          </div>
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="border bg-zinc-700 dark:bg-neutral-500">
                  <StarsIcon className="size-4" />
                  Generate MCQs
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle asChild>
                    <p className="text-xl">Practice MCQ Questions</p>
                  </DialogTitle>
                  <DialogDescription>Practice AI-powered MCQs based on the content of this material.</DialogDescription>
                </DialogHeader>
                {materialData.content ? (
                  <MCQView materialContent={materialData.content} subjectName={classInfo.subjectName} />
                ) : (
                  "No content to generate MCQs on is available in this document"
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <h1 className="font-bold text-xl md:text-2xl">{materialData.title}</h1>
        <small className="-mt-4 text-sm">Created on: {new Date(materialData.createdAt).toLocaleDateString()}</small>
        <article>{materialData.content}</article>
      </section>
    </>
  );
}
