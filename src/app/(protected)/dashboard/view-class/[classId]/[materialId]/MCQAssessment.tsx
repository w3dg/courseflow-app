"use client";

import { useState } from "react";
import { Question } from "./MCQView";
import MCQQuestionForm from "./MCQQuestionForm";

function MCQAssessment({ questions }: { questions: Question[] }) {
  const maxScore = questions.length;
  const [score, setScore] = useState(0);

  const [currQuestionIndex, setCurrQuestionIndex] = useState(0);
  const [currQuestion, setNextQuestion] = useState(questions[currQuestionIndex]);

  const [finished, setFinished] = useState(false);

  const addScore = () => setScore(score + 1);
  const nextQuestion = (wasCorrect: boolean) => {
    if (wasCorrect) {
      addScore();
    }
    if (currQuestionIndex < questions.length - 1) {
      setCurrQuestionIndex(currQuestionIndex + 1);
      setNextQuestion(questions[currQuestionIndex + 1]);
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {!finished && (
        <MCQQuestionForm
          question={currQuestion}
          updateFn={nextQuestion}
          isLastQuestion={currQuestionIndex === questions.length - 1}
        />
      )}
      {finished && (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Assessment Completed!</h1>
          <p className="text-lg font-semibold">
            Your score: {score}/{maxScore}
          </p>
        </div>
      )}
    </div>
  );
}

export default MCQAssessment;
