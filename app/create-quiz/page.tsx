"use client";

import { useState, FormEvent } from "react";

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

export default function CreateQuizPage() {
  const [questions, setQuestions] = useState(["", "", ""]);
  const [answers, setAnswers] = useState(["", "", ""]);
  const [videoId, setVideoId] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [error, setError] = useState("");

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (questions.some(q => !q) || answers.some(a => !a) || !videoId) {
      setError("Please fill out all fields.");
      return;
    }
    setError("");

    const hashedAnswers = await Promise.all(
      answers.map((a) => sha256(a.toLowerCase().trim()))
    );

    const params = new URLSearchParams({
      q1: questions[0],
      q2: questions[1],
      q3: questions[2],
      ha1: hashedAnswers[0],
      ha2: hashedAnswers[1],
      ha3: hashedAnswers[2],
      videoId: videoId,
    });

    const url = `${window.location.origin}/reading-quiz?${params.toString()}`;
    setGeneratedUrl(url);
  };

  return (
    <div className="min-h-screen bg-[#f5f5dc] text-[#333333] font-mono p-5 flex flex-col items-center">
      <div className="w-full max-w-2xl border border-[#cccccc] bg-[#e8e8d8] p-4 rounded-md shadow-sm">
        <h1 className="text-2xl font-bold text-[#8b0000] mb-4 text-center">
          Create Reading Quiz
        </h1>
        <form onSubmit={handleSubmit}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="mb-4">
              <label htmlFor={`q${i}`} className="block mb-1">
                Question {i + 1}
              </label>
              <input
                type="text"
                id={`q${i}`}
                value={questions[i]}
                onChange={(e) => handleQuestionChange(i, e.target.value)}
                className="w-full p-2 border border-[#cccccc] rounded bg-[#f5f5dc]"
              />
              <label htmlFor={`a${i}`} className="block mb-1 mt-2">
                Answer {i + 1}
              </label>
              <input
                type="text"
                id={`a${i}`}
                value={answers[i]}
                onChange={(e) => handleAnswerChange(i, e.target.value)}
                className="w-full p-2 border border-[#cccccc] rounded bg-[#f5f5dc]"
              />
            </div>
          ))}
          <div className="mb-4">
            <label htmlFor="videoId" className="block mb-1">
              YouTube Video ID
            </label>
            <input
              type="text"
              id="videoId"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              className="w-full p-2 border border-[#cccccc] rounded bg-[#f5f5dc]"
              placeholder="e.g. dQw4w9WgXcQ"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#8b0000] text-white p-2 rounded hover:bg-[#a52a2a] transition-colors"
          >
            Generate Quiz URL
          </button>
        </form>
        {generatedUrl && (
          <div className="mt-6">
            <h2 className="text-xl font-bold text-green-600 mb-2 text-center">
              Quiz URL Generated!
            </h2>
            <p className="text-center mb-2">
              Copy and share this URL for the quiz:
            </p>
            <textarea
              readOnly
              value={generatedUrl}
              className="w-full p-2 border border-[#cccccc] rounded bg-[#f5f5dc] h-24"
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
