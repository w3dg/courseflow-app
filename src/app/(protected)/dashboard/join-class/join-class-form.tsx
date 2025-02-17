"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Link } from "lucide-react";

import { ClassesWithTeacher, joinClassSchema } from "@/db/schema";
import { createEnrollment } from "@/app/actions/join-class";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const joinClassSchemaWithoutStudentId = joinClassSchema.omit({ userId: true });

export default function JoinClassForm({
  studentId,
  availableClasses,
}: {
  studentId: string;
  availableClasses: ClassesWithTeacher[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const form = useForm<z.infer<typeof joinClassSchemaWithoutStudentId>>({
    resolver: zodResolver(joinClassSchemaWithoutStudentId),
    defaultValues: {
      isPending: false,
      classId: "",
    },
  });

  const joinClassWithStudentId = createEnrollment.bind(null, studentId);

  async function onSubmit(values: z.infer<typeof joinClassSchemaWithoutStudentId>) {
    if (values.classId === "") {
      setErrorMessage("Please select a class to join.");
      return;
    }

    setIsLoading(true);

    const { error } = await joinClassWithStudentId(values);

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
            <AlertTitle>Couldn't join class</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="classId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Which class to join</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class to join" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableClasses.map((cls) => (
                    <SelectItem
                      key={cls.id}
                      value={cls.id}
                    >{`${cls.subjectName} - ${cls.classTeacher.name}`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                You are being shown only the classes that are available for you to join.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
