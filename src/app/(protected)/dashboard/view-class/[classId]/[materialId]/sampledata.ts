import { Question } from "./MCQView";

export const sampleData: Question[] = [
  {
    question: "What core mechanism do Large Language Models (LLMs) use to process and generate human-like text?",
    answers: [
      {
        answer: "They utilize recurrent neural networks (RNNs) to process sequential data efficiently.",
        correct: false,
      },
      {
        answer: "They employ transformer models, focusing on relevant input parts via an encoder-decoder structure.",
        correct: true,
      },
      { answer: "They use convolutional neural networks (CNNs) to identify patterns in text data.", correct: false },
      {
        answer: "They rely on simple rule-based systems to generate text based on predefined patterns.",
        correct: false,
      },
    ],
  },
  {
    question: "Which of the following applications best exemplifies the use of LLMs?",
    answers: [
      { answer: "Sentiment analysis and information retrieval.", correct: false },
      { answer: "Text generation, code generation, and chatbots.", correct: true },
      { answer: "Data mining, statistical analysis, and machine learning.", correct: false },
      { answer: "Image recognition, object detection, and video processing.", correct: false },
    ],
  },
  {
    question: "How are Large Language Models (LLMs) typically trained?",
    answers: [
      { answer: "LLMs are trained on small, curated datasets to ensure accuracy.", correct: false },
      { answer: "LLMs are trained on extremely large datasets using deep learning techniques.", correct: true },
      { answer: "LLMs are trained using supervised learning exclusively.", correct: false },
      { answer: "LLMs do not require extensive training data.", correct: false },
    ],
  },
  {
    question: "What is a key characteristic of the functional capabilities of LLMs?",
    answers: [
      { answer: "They focus solely on generating creative text formats.", correct: false },
      { answer: "They are limited to performing only a single specific task.", correct: false },
      {
        answer: "They can perform diverse tasks like answering questions, summarizing, and translating.",
        correct: true,
      },
      { answer: "They primarily function as simple search engines.", correct: false },
    ],
  },
  {
    question: "How do LLMs utilize transformer models to generate human-like text?",
    answers: [
      { answer: "LLMs are incapable of understanding context within sentences.", correct: false },
      { answer: "LLMs cannot generate text that is tailored to specific prompts.", correct: false },
      {
        answer:
          "LLMs use transformer models to understand relationships within sentences and generate contextually relevant text.",
        correct: true,
      },
      { answer: "LLMs primarily rely on keyword matching for text generation.", correct: false },
    ],
  },
];
