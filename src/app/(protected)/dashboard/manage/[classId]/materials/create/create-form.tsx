"use client";

import { Classes, CreateMaterialSchema } from "@/db/schema";
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
import { createMaterial } from "@/app/actions/create-material";
import { Textarea } from "@/components/ui/textarea";

interface CreateMaterialProps {
  classInfo: Classes;
}

const createMaterialSchemaWithoutClassId = CreateMaterialSchema.omit({ classId: true });

export default function CreateForm({ classInfo }: CreateMaterialProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const form = useForm<z.infer<typeof createMaterialSchemaWithoutClassId>>({
    resolver: zodResolver(createMaterialSchemaWithoutClassId),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const createMaterialWithClassId = createMaterial.bind(null, classInfo.id);

  async function onSubmit(values: z.infer<typeof createMaterialSchemaWithoutClassId>) {
    setIsLoading(true);

    const { error } = await createMaterialWithClassId(values);

    if (error) {
      setIsLoading(false);
      setErrorMessage(error);
    } else {
      router.push(`/dashboard/manage/${classInfo.id}/materials`);
    }
  }

  if (!session) {
    return null;
  }

  return (
    <Form {...form}>
      <h2 className="text-lg">
        Create material for {classInfo.subjectName}{" "}
        <span className="text-secondary-foreground/80">({classInfo.code})</span>
      </h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Couldn't create material.</AlertTitle>
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
                <Textarea placeholder="Lecture Content" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
