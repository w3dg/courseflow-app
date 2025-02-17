import { eq } from "drizzle-orm";
import { Classes, classes, EnrolledClasses, enrollments } from "@/db/schema";
import { requireAuth } from "@/app/utils/require-auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/db";
import Link from "next/link";
import { Suspense } from "react";

function LoadingDotsSkeleton() {
  return (
    <div className="w-full p-4">
      <div className="flex gap-1 items-center justify-center">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}

async function TeachersClasses({ userId }: { userId: string }) {
  let resultClasses: Classes[] = await db.query.classes.findMany({
    where: eq(classes.classTeacherId, userId),
  });
  return (
    <>
      {resultClasses.map((cls) => (
        <Card key={cls.id}>
          <CardHeader>
            <CardTitle>{cls.subjectName}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{cls.code}</CardDescription>
          </CardContent>
          <CardFooter className="grid">
            <Button variant={"outline"}>View class</Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}

async function StudentEnrolledClasses({ userId }: { userId: string }) {
  let resultClasses: EnrolledClasses[] = await db.query.enrollments.findMany({
    with: {
      classes: true,
    },
    where: eq(enrollments.userId, userId),
  });

  return (
    <>
      {resultClasses.map((cls) => (
        <Card key={cls.classId}>
          <CardHeader>
            <CardTitle>{cls.classes.subjectName}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{cls.classes.code}</CardDescription>
          </CardContent>
          <CardFooter className="grid">
            <Button variant={"outline"}>View class</Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}

async function Dashboard() {
  const session = await requireAuth();

  return (
    <div className="flex flex-col gap-4 mt-4">
      {/* Manage classes */}
      <div className="flex items-center">
        {session.user.role === "teacher" ? (
          <Link href="/dashboard/create-class">
            <Button variant={"default"}>Create class</Button>
          </Link>
        ) : (
          <Link href="/dashboard/join-class">
            <Button variant={"default"}>Join class</Button>
          </Link>
        )}
      </div>
      <div>
        <h2 className="text-lg">Your classes</h2>
      </div>

      {/* List classes */}
      <Suspense fallback={<LoadingDotsSkeleton />}>
        {session.user.role === "teacher" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            <TeachersClasses userId={session.user.id} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            <StudentEnrolledClasses userId={session.user.id} />
          </div>
        )}
      </Suspense>
    </div>
  );
}

export default Dashboard;
