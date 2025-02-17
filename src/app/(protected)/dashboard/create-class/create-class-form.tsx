"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import { createClassSchema } from "@/db/schema";
import { createClass } from "@/app/actions/create-class";

const createClassSchemaWithoutTeacherId = createClassSchema.omit({ classTeacherId: true });

export default function CreateClassForm({ teacherId }: { teacherId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const form = useForm<z.infer<typeof createClassSchemaWithoutTeacherId>>({
    resolver: zodResolver(createClassSchemaWithoutTeacherId),
    defaultValues: {
      subjectName: "",
      code: "",
    },
  });

  const createClassWithTeacherId = createClass.bind(null, teacherId);

  async function onSubmit(values: z.infer<typeof createClassSchemaWithoutTeacherId>) {
    setIsLoading(true);

    const { error } = await createClassWithTeacherId(values);

    if (error) {
      setIsLoading(false);
      setErrorMessage(error);
    } else {
      router.push("/dashboard");
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
            <AlertTitle>Couldn't sign you in</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="subjectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject Name</FormLabel>
              <FormControl>
                <Input placeholder="Math 201" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject Code</FormLabel>
              <FormControl>
                <Input placeholder="MTH-201" {...field} />
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
