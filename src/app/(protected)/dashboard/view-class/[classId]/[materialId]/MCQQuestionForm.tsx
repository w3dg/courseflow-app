"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Question } from "./MCQView";
import { useEffect, useState } from "react";

const FormSchema = z.object({
  selectedOption: z.enum(
    ["0", "1", "2", "3"], // 4 options
    {
      required_error: "You need to choose a valid option",
    }
  ),
});

export default function MCQQuestionForm({
  question,
  updateFn,
  isLastQuestion,
}: {
  question: Question;
  updateFn: (wasCorrect: boolean) => void;
  isLastQuestion: boolean;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    // Reset form and clear selection completely
    form.reset();
    setAnswered(false);
    setCorrect(false);
  }, [question, form]);

  const handleNextQuestion = () => {
    updateFn(correct);
    setAnswered(false);
    setCorrect(false);
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const selectedAnswerIndex = parseInt(data.selectedOption);
    const selectedAnswer = question.answers[selectedAnswerIndex];

    if (selectedAnswer.correct) {
      setCorrect(true);
    } else {
      setCorrect(false);
    }

    setAnswered(true);
  }

  return (
    <Form {...form} key={question.question}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 text-lg">
        <FormField
          control={form.control}
          name="selectedOption"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel asChild>
                <h3 className="font-semibold">{question.question}</h3>
              </FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-1">
                  {question.answers.map((ans, index) => (
                    <FormItem className="flex items-center space-x-3 space-y-0" key={index}>
                      <FormControl>
                        <RadioGroupItem value={"" + index} />
                      </FormControl>
                      <FormLabel className="font-normal">{ans.answer}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button type="submit" disabled={answered} aria-disabled={answered}>
            Submit
          </Button>
          {!isLastQuestion && (
            <Button
              disabled={!answered}
              aria-disabled={!answered}
              className="bg-blue-800 hover:bg-blue-600 text-white"
              onClick={handleNextQuestion}
            >
              Next Question
            </Button>
          )}
          {isLastQuestion && (
            <Button
              disabled={!answered}
              aria-disabled={!answered}
              className="bg-lime-800 hover:bg-lime-600 text-white"
              onClick={handleNextQuestion}
            >
              End Assessment
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
