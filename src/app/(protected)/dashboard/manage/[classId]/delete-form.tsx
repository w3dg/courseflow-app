"use client";
import { deleteClass } from "@/app/actions/delete-class";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { AlertCircle, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

function DeleteForm({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const deleteClassWithId = deleteClass.bind(null, id);

  const form = useForm({});

  async function onSubmit() {
    setIsLoading(true);

    const { error } = await deleteClassWithId();

    if (error) {
      setIsLoading(false);
      setErrorMessage(error);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Couldn't delete class</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <Button
          variant={"destructive"}
          className="flex gap-1 items-center"
          type="submit"
          disabled={isLoading}
          aria-disabled={isLoading}
        >
          <Trash2Icon className="w-4 h-4" /> Yes, delete class
        </Button>
      </form>
    </Form>
  );
}

export default DeleteForm;
