"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Subpart {
  A?: string;
  B?: string;
  C?: string;
}

interface Question {
  question_id: string;
  instruction: string;
  subparts: Subpart;
}

interface QuestionPaper {
  questions: Question[];
}

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([
    { question_id: "Q1", instruction: "", subparts: { A: "", B: "", C: "" } },
  ]);
  const [answers, setAnswers] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question_id: `Q${questions.length + 1}`, instruction: "", subparts: { A: "", B: "", C: "" } },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (
    index: number,
    field: "question_id" | "instruction" | "subparts",
    value: string,
    subpartKey?: "A" | "B" | "C"
  ) => {
    const updatedQuestions = [...questions];
    if (field === "subparts" && subpartKey) {
      updatedQuestions[index].subparts[subpartKey] = value;
    } else if (field !== "subparts") {
      updatedQuestions[index][field] = value;
    }
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const questionPaper: QuestionPaper = { questions };
      const response = await axios.post("http://localhost:8000/generate-answers/", questionPaper);
      setAnswers(response.data.answers);
    } catch (error) {
      console.error("Error generating answers:", error);
      setAnswers("An error occurred while generating answers.");
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Modal Answer sheet</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((question, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-sm space-y-4">
            <div>
              <Label htmlFor={`question_id_${index}`}>Question ID</Label>
              <Input
                id={`question_id_${index}`}
                value={question.question_id}
                onChange={(e) => updateQuestion(index, "question_id", e.target.value)}
                placeholder="e.g., Q1"
                required
              />
            </div>
            <div>
              <Label htmlFor={`instruction_${index}`}>Instruction</Label>
              <Input
                id={`instruction_${index}`}
                value={question.instruction}
                onChange={(e) => updateQuestion(index, "instruction", e.target.value)}
                placeholder="e.g., Solve any 1 out of Q1 or Q2"
              />
            </div>
            <div className="space-y-2">
              <Label>Subparts</Label>
              <div>
                <Label htmlFor={`subpart_A_${index}`}>Subpart A</Label>
                <Input
                  id={`subpart_A_${index}`}
                  value={question.subparts.A || ""}
                  onChange={(e) => updateQuestion(index, "subparts", e.target.value, "A")}
                  placeholder="Enter subpart A"
                />
              </div>
              <div>
                <Label htmlFor={`subpart_B_${index}`}>Subpart B</Label>
                <Input
                  id={`subpart_B_${index}`}
                  value={question.subparts.B || ""}
                  onChange={(e) => updateQuestion(index, "subparts", e.target.value, "B")}
                  placeholder="Enter subpart B"
                />
              </div>
              <div>
                <Label htmlFor={`subpart_C_${index}`}>Subpart C</Label>
                <Input
                  id={`subpart_C_${index}`}
                  value={question.subparts.C || ""}
                  onChange={(e) => updateQuestion(index, "subparts", e.target.value, "C")}
                  placeholder="Enter subpart C"
                />
              </div>
            </div>
            <Button
              type="button"
              variant="destructive"
              onClick={() => removeQuestion(index)}
              disabled={questions.length === 1}
            >
              Remove Question
            </Button>
          </div>
        ))}
        <div className="flex space-x-4">
          <Button type="button" onClick={addQuestion}>
            Add Question
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Generating..." : "Generate Answers"}
          </Button>
        </div>
      </form>

      {answers && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Generated Answers</h2>
          <pre className="bg-gray-100 p-4 rounded-lg shadow-sm overflow-auto">{answers}</pre>
        </div>
      )}
    </div>
  );
}