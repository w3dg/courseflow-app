import { Button } from "@/components/ui/button";
import { db } from "@/db";
import Link from "next/link";
import React from "react";

async function ViewClassPage({ params }: { params: Promise<{ classId: string }> }) {
  const classId = (await params).classId;

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
        <Link href={"/dashboard"}>
          <Button variant="link">Go back to dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-1 mt-8">
      <h1 className="font-bold text-xl md:text-2xl">{classInfo.subjectName}</h1>
      <p className="text-lg">Teacher: {classInfo.classTeacher.name}</p>
    </section>
  );
}

export default ViewClassPage;
