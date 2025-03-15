import { requireAuth } from "@/app/utils/require-auth";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import CreateForm from "./create-form";

export default async function CreateMaterialPage({ params }: { params: Promise<{ classId: string }> }) {
  const classId = (await params).classId;

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

  return (
    <>
      <section className="flex flex-col gap-8 mt-8">
        <h1 className="font-bold text-xl md:text-2xl">{classInfo?.subjectName} - Materials</h1>
        <Link href={`/dashboard/manage/${classId}`}>
          <Button variant={"outline"}>Back to class overview</Button>
        </Link>
        <CreateForm classInfo={classInfo}></CreateForm>
      </section>
    </>
  );
}
