import { requireAuth } from "@/app/utils/require-auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import CreateClassForm from "./create-class-form";

async function CreateClassPage() {
  const session = await requireAuth();

  if (session.user.role === "student") {
    redirect("/dashboard");
  }

  return (
    <section className="px-4 md:px-6 lg:px-8 py-4 flex flex-col items-center">
      <h1 className="text-xl font-bold">Create Class</h1>
      <div className="w-full max-w-lg mt-4 mx-auto">
        <CreateClassForm teacherId={session.user.id} />
      </div>
      <Link href="/dashboard">
        <Button variant={"link"}>Cancel</Button>
      </Link>
    </section>
  );
}

export default CreateClassPage;
