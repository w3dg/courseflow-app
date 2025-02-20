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
import DeleteForm from "./delete-form";

async function ViewClassPage({ params }: { params: Promise<{ classId: string }> }) {
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

  return (
    <section className="flex flex-col gap-1 mt-8">
      <div className="flex flex-col gap-4 items-start md:flex-row md:justify-between">
        <div>
          <h1 className="font-bold text-xl md:text-2xl">Manage Class</h1>
          <h2 className="text-lg md:text-xl">
            {classInfo.subjectName} <span className="text-muted-foreground">{classInfo.code}</span>
          </h2>
        </div>
        <div className="flex gap-2 items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"destructive"} className="flex gap-1 items-center">
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
              <DeleteForm id={classId} />
            </DialogContent>
          </Dialog>

          <Link href={`/dashboard/view-class/${classId}`}>
            <Button variant={"outline"}>Back to Class</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ViewClassPage;
