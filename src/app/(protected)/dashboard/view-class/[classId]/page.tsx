import { requireAuth } from "@/app/utils/require-auth";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import Link from "next/link";
import { redirect } from "next/navigation";

async function ViewClassPage({ params }: { params: Promise<{ classId: string }> }) {
  const classId = (await params).classId;

  const session = await requireAuth();

  const classInfo = await db.query.classes.findFirst({
    where: (classes, { eq }) => eq(classes.id, classId),
    with: {
      classTeacher: true,
    },
  });

  if (!classInfo) {
    return (
      <div className="flex flex-col gap-1 items-center">
        <h1 className="text-lg md:text-xl">Class not found</h1>
        <p className="text-base md:text-lg text-muted-foreground">It may have been deleted.</p>
        <Link href={"/dashboard"}>
          <Button variant="link">Go back to dashboard</Button>
        </Link>
      </div>
    );
  }

  // check if the student belongs to this class
  if (session.user.role === "student") {
    const studentClasses = await db.query.enrollments.findMany({
      where: (fields, { eq }) => eq(fields.userId, session.user.id),
      columns: {
        classId: true,
      },
    });

    const studentBelongsToClass = studentClasses.filter((cls) => cls.classId === classId);

    if (studentBelongsToClass.length === 0) {
      redirect("/dashboard");
    }
  }

  return (
    <section className="flex flex-col gap-1 mt-8">
      <div className="flex flex-col gap-4 items-start md:flex-row md:justify-between">
        <div>
          <h1 className="font-bold text-xl md:text-2xl">{classInfo.subjectName}</h1>
          <p className="text-lg">Teacher: {classInfo.classTeacher.name}</p>
        </div>
        {session.user.role === "teacher" && (
          <Link href={`/dashboard/manage/${classId}`}>
            <Button variant={"outline"}>Manage class</Button>
          </Link>
        )}
      </div>
    </section>
  );
}

export default ViewClassPage;
