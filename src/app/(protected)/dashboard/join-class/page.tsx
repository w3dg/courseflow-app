import { redirect } from "next/navigation";

import { requireAuth } from "@/app/utils/require-auth";
import { db } from "@/db";

import JoinClassForm from "./join-class-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { classes, enrollments } from "@/db/schema";
import { inArray } from "drizzle-orm";

async function JoinClassPage() {
  const session = await requireAuth();

  if (session.user.role === "teacher") {
    redirect("/dashboard");
  }

  const enrolledClasses = await db.query.enrollments.findMany({
    columns: {
      classId: true,
    },
    where: (enrollments, { eq }) => eq(enrollments.userId, session.user.id),
  });

  const enrolledClassIds = enrolledClasses.map((enrollment) => enrollment.classId);

  const availableClasses = await db.query.classes.findMany({
    orderBy: (classes, { asc }) => [asc(classes.subjectName)],
    with: {
      classTeacher: true,
    },
    where: (classes, { notInArray }) => notInArray(classes.id, enrolledClassIds),
  });

  return (
    <section className="px-4 md:px-6 lg:px-8 py-4 flex flex-col items-center">
      <h1 className="text-xl font-bold">Join Class</h1>
      <div className="w-full max-w-lg mt-4 mx-auto">
        <JoinClassForm studentId={session.user.id} availableClasses={availableClasses} />
      </div>
      <Link href="/dashboard">
        <Button variant={"link"}>Cancel</Button>
      </Link>
    </section>
  );
}

export default JoinClassPage;
