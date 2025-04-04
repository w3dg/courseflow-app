"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import MCQAssessment from "./MCQAssessment";
import { Loader } from "lucide-react";

// import { sampleData } from "./sampledata";

export interface Answer {
  answer: string;
  correct: boolean;
}

export interface Question {
  question: string;
  answers: Answer[];
}

function MCQView({ subjectName, materialContent }: { subjectName: string; materialContent: string }) {
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <main>
      <div className="flex flex-col items-center justify-center">
        {generatedQuestions.length === 0 && (
          <Button
            onClick={async () => {
              setIsLoading(true);
              await new Promise((resolve) => setTimeout(resolve, 2000));

              const response = await fetch("/api/mcqs", {
                method: "POST",
                body: JSON.stringify({
                  materialContent: materialContent,
                  subjectName: subjectName,
                }),
              });

              const json = await response.json();
              setGeneratedQuestions(json);
              setIsLoading(false);
            }}
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Generating MCQs...
              </>
            ) : (
              "Generate MCQs"
            )}
          </Button>
        )}

        {generatedQuestions.length > 0 && <MCQAssessment questions={generatedQuestions} />}
      </div>
    </main>
  );
}

export default MCQView;
