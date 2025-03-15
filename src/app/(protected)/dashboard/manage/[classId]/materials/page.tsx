import { requireAuth } from "@/app/utils/require-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { db } from "@/db";
import { PencilLineIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import DeleteMaterialForm from "./delete-material-form";

export default async function ManageClassPage({ params }: { params: Promise<{ classId: string }> }) {
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

  const classMaterials = await db.query.material.findMany({
    where: (material, { eq }) => eq(material.classId, classId),
  });

  return (
    <>
      <section className="flex flex-col gap-8 mt-8">
        <h1 className="font-bold text-xl md:text-2xl">{classInfo?.subjectName} - Materials</h1>
        <div className="flex gap-2 items-center">
          <Link href={`/dashboard/manage/${classId}`}>
            <Button variant={"outline"}>Back to class overview</Button>
          </Link>
          {classMaterials.length !== 0 && (
            <Link href={`/dashboard/manage/${classId}/materials/create`}>
              <Button>Create a material</Button>
            </Link>
          )}
        </div>
      </section>

      {classMaterials.length === 0 ? (
        <div className="flex flex-col gap-4 items-center my-8">
          <h1 className="text-lg md:text-xl">No materials found</h1>
          <Link href={`/dashboard/manage/${classId}/materials/create`}>
            <Button>Create a material</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {classMaterials.map((material) => (
            <Card key={material.id}>
              <CardHeader>
                <CardTitle>{material.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-ellipsis line-clamp-4">
                  {material.content}
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam non quia id tenetur error, officia
                  odio vero. Alias, esse natus. Enim sequi, vel beatae nulla quisquam, consequuntur ex quasi quos a
                  suscipit, dolorem tenetur adipisci similique. Quos consequatur autem explicabo! Hic debitis pariatur
                  vitae fugiat sed sunt sequi expedita architecto! Lorem ipsum dolor sit amet consectetur adipisicing
                  elit. Laboriosam non quia id tenetur error, officia odio vero. Alias, esse natus. Enim sequi, vel
                  beatae nulla quisquam, consequuntur ex quasi quos a suscipit, dolorem tenetur adipisci similique. Quos
                  consequatur autem explicabo! Hic debitis pariatur vitae fugiat sed sunt sequi expedita architecto!
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </CardContent>
              <CardFooter className="gap-2">
                <Link href={`/dashboard/manage/${classId}/materials/edit/${material.id}`}>
                  <Button
                    variant={"outline"}
                    className="flex gap-1 items-center bg-sky-200 text-sky-700 hover:bg-sky-300 hover:text-sky-700"
                  >
                    <PencilLineIcon className="w-4 h-4" /> Edit
                  </Button>
                </Link>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="flex gap-1 items-center bg-red-200 text-red-700 hover:bg-red-300 hover:text-red-700"
                    >
                      <Trash2Icon className="w-4 h-4" /> Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription className="text-balance">
                        This action cannot be undone. This will permanently delete the class and all associated
                        materials.
                      </DialogDescription>
                    </DialogHeader>
                    <DeleteMaterialForm materialId={material.id} classId={classId} />
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
