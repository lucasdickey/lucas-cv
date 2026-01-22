"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

const YOUTUBE_ACCESS_DURATION = 30 * 60 * 1000; // 30 minutes

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

export default function ReadingQuizPage() {
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState<string[]>([]);
  const [correctAnswerHashes, setCorrectAnswerHashes] = useState<string[]>([]);
  const [youtubeId, setYoutubeId] = useState<string | null>(null);

  const [answers, setAnswers] = useState(["", "", ""]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [error, setError] = useState("");
  const [timeUp, setTimeUp] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const q1 = searchParams.get("q1");
    const q2 = searchParams.get("q2");
    const q3 = searchParams.get("q3");
    const ha1 = searchParams.get("ha1");
    const ha2 = searchParams.get("ha2");
    const ha3 = searchParams.get("ha3");
    const videoId = searchParams.get("videoId");

    if (q1 && q2 && q3 && ha1 && ha2 && ha3 && videoId) {
      setQuestions([q1, q2, q3]);
      setCorrectAnswerHashes([ha1, ha2, ha3]);
      setYoutubeId(videoId);
    }
  }, [searchParams]);

  useEffect(() => {
    const accessEndTime = localStorage.getItem("youtubeAccessEndTime");
    if (accessEndTime) {
      const endTime = parseInt(accessEndTime, 10);
      const now = new Date().getTime();

      if (now >= endTime) {
        setTimeUp(true);
        localStorage.removeItem("youtubeAccessEndTime");
      } else {
        setIsCorrect(true);
        const remainingTime = endTime - now;
        timerRef.current = setTimeout(() => {
          setTimeUp(true);
          setIsCorrect(false);
          localStorage.removeItem("youtubeAccessEndTime");
        }, remainingTime);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const submittedAnswerHashes = await Promise.all(
      answers.map((a) => sha256(a.toLowerCase().trim()))
    );

    if (
      submittedAnswerHashes[0] === correctAnswerHashes[0] &&
      submittedAnswerHashes[1] === correctAnswerHashes[1] &&
      submittedAnswerHashes[2] === correctAnswerHashes[2]
    ) {
      setIsCorrect(true);
      setError("");
      const endTime = new Date().getTime() + YOUTUBE_ACCESS_DURATION;
      localStorage.setItem("youtubeAccessEndTime", endTime.toString());
      timerRef.current = setTimeout(() => {
        setTimeUp(true);
        setIsCorrect(false);
        localStorage.removeItem("youtubeAccessEndTime");
      }, YOUTUBE_ACCESS_DURATION);
    } else {
      setError("Sorry, that's not quite right. Please try again.");
    }
  };

  if (!questions.length || !correctAnswerHashes.length || !youtubeId) {
    return (
      <div className="min-h-screen bg-[#f5f5dc] text-[#333333] font-mono p-5 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl border border-[#cccccc] bg-[#e8e8d8] p-4 rounded-md shadow-sm text-center">
          <h1 className="text-2xl font-bold text-[#8b0000] mb-4">
            Invalid Quiz URL
          </h1>
          <p>Please make sure you have a valid quiz URL with questions, answers, and a YouTube video ID.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5dc] text-[#333333] font-mono p-5 flex flex-col items-center">
      <div className="w-full max-w-2xl border border-[#cccccc] bg-[#e8e8d8] p-4 rounded-md shadow-sm">
        <h1 className="text-2xl font-bold text-[#8b0000] mb-4 text-center">
          Reading Quiz
        </h1>
        {timeUp ? (
           <div>
            <h2 className="text-xl font-bold text-red-600 mb-4 text-center">
              Time's up! I hope you enjoyed your video.
            </h2>
          </div>
        ) : isCorrect ? (
          <div>
            <h2 className="text-xl font-bold text-green-600 mb-4 text-center">
              Great job! You've unlocked your YouTube time.
            </h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded"
              ></iframe>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {questions.map((q, i) => (
              <div className="mb-4" key={i}>
                <label htmlFor={`q${i}`} className="block mb-2">
                  {i + 1}. {q}
                </label>
                <input
                  type="text"
                  id={`q${i}`}
                  name={`q${i}`}
                  value={answers[i]}
                  onChange={(e) => handleChange(e, i)}
                  className="w-full p-2 border border-[#cccccc] rounded bg-[#f5f5dc]"
                />
              </div>
            ))}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-[#8b0000] text-white p-2 rounded hover:bg-[#a52a2a] transition-colors"
            >
              Submit Answers
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
