"use client";

import { EditMaterialSchema, Material } from "@/db/schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateMaterial } from "@/app/actions/update-material";

interface EditMaterialProps {
  classId: string;
  materialId: string;
  initialData: Material;
}

export default function EditMaterialForm({ classId, materialId, initialData }: EditMaterialProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const form = useForm<z.infer<typeof EditMaterialSchema>>({
    resolver: zodResolver(EditMaterialSchema),
    defaultValues: {
      title: initialData.title,
      content: initialData.content,
    },
  });

  const editMaterialWithId = updateMaterial.bind(null, classId, materialId);

  async function onSubmit(values: z.infer<typeof EditMaterialSchema>) {
    setIsLoading(true);

    const { error } = await editMaterialWithId(values);

    if (error) {
      setIsLoading(false);
      setErrorMessage(error);
    } else {
      router.push(`/dashboard/manage/${classId}/materials`);
    }
  }

  if (!session) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Couldn't update material.</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Lecture Note 22" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Input placeholder="Content" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save Edits</Button>
      </form>
    </Form>
  );
}
