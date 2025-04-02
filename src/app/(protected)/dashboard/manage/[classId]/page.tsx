import { requireAuth } from "@/app/utils/require-auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { db } from "@/db";
import { Trash2Icon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import DeleteClassForm from "./delete-form";

async function ManageClassPage({ params }: { params: Promise<{ classId: string }> }) {
  const classId = (await params).classId;

  const session = await requireAuth();

  if (session.user.role !== "teacher") {
    redirect(`/dashboard/view-class/${classId}`);
  }

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

  const studentsOfClass = await db.query.enrollments.findMany({
    where: (enrollments, { eq }) => eq(enrollments.classId, classId),
    with: {
      user: true,
    },
  });

  return (
    <section className="flex flex-col gap-8 mt-8">
      <div className="flex flex-col gap-4 items-start md:flex-row md:justify-between">
        <div>
          <h1 className="font-bold text-xl md:text-2xl">Manage Class</h1>
          <h2 className="text-lg md:text-xl">
            {classInfo.subjectName} <span className="text-muted-foreground">{classInfo.code}</span>
          </h2>
        </div>
        <div className="flex gap-2 items-center">
          <Link href={`/dashboard/view-class/${classId}`}>
            <Button variant={"outline"}>Back to Class</Button>
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant={"outline"}
                className="flex gap-1 items-center bg-red-200 text-red-700 hover:bg-red-300 hover:text-red-700"
              >
                <Trash2Icon className="w-4 h-4" /> Delete Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription className="text-balance">
                  This action cannot be undone. This will permanently delete the class and all associated materials.
                </DialogDescription>
              </DialogHeader>
              <DeleteClassForm id={classId} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Link href={`/dashboard/manage/${classId}/materials`}>
        <Button variant={"outline"}>Manage Materials for {classInfo.subjectName}</Button>
      </Link>
      <div>
        <h2 className="font-bold text-base">Participants in this class</h2>
        <div className="flex flex-col gap-2 mt-4">
          <ul className="flex flex-col gap-2">
            {studentsOfClass.map((student) => (
              <li key={student.userId} className="">
                {student.user.name} <span className="text-muted-foreground">({student.user.email})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default ManageClassPage;
