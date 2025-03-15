"use client";
import { deleteMaterial } from "@/app/actions/delete-material";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { AlertCircle, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function DeleteMaterialForm({ materialId, classId }: { materialId: string; classId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const deleteMaterialWithId = deleteMaterial.bind(null, materialId, classId);

  const form = useForm({});

  async function onSubmit() {
    setIsLoading(true);

    const { error } = await deleteMaterialWithId();

    if (error) {
      setIsLoading(false);
      setErrorMessage(error);
    } else {
      router.push(`/dashboard/manage/${classId}/materials`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Couldn't delete material</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <Button
          variant={"destructive"}
          className="flex gap-1 items-center bg-red-200 text-red-700 hover:bg-red-300 hover:text-red-700"
          type="submit"
          disabled={isLoading}
          aria-disabled={isLoading}
        >
          <Trash2Icon className="w-4 h-4" /> Yes, delete material
        </Button>
      </form>
    </Form>
  );
}
