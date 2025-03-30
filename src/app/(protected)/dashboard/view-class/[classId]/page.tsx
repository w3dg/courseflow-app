import { requireAuth } from "@/app/utils/require-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

  const classMaterials = await db.query.material.findMany({
    where: (material, { eq }) => eq(material.classId, classId),
  });

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {classMaterials.map((material) => (
          <Card key={material.id}>
            <CardHeader>
              <CardTitle>{material.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-ellipsis line-clamp-4">{material.content}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/dashboard/view-class/${classId}/${material.id}`}>
                <Button variant="secondary">View material</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default ViewClassPage;
