"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function QuizPage() {
  const { id } = useParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${id}`
        );
        console.log("Fetched quiz:", res.data);
        setQuiz(res.data);
      } catch (err) {
        console.error("Error fetching quiz:", err.message);
      }
    };
    fetchQuiz();
  }, [id]);

  const currentQuestion = quiz?.questions?.[currentIndex];

  const handleAnswerChange = (value) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: value }));
  };

  const handleNext = () => {
    if (!answers[currentIndex] || answers[currentIndex].trim() === "") {
      alert("Please select or enter an answer before continuing.");
      return;
    }

    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const unanswered = quiz.questions.findIndex((_, i) => !answers[i]);
    if (unanswered !== -1) {
      alert(`Please answer Question ${unanswered + 1} before submitting.`);
      setCurrentIndex(unanswered);
      return;
    }

    let scoreCount = 0;
    quiz.questions.forEach((q, i) => {
      const userAnswer = answers[i];
      if (
        userAnswer &&
        userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
      ) {
        scoreCount++;
      }
    });

    setScore(scoreCount);
    setSubmitted(true);
  };


  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleCancel = (e) => {
    if (confirm('Are you sure? You will loose your progress.')) {
      e.preventDefault();
      router.push("/");
    }
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <p className="text-center mt-20 text-gray-500">Loading quiz...</p>;
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto text-center mt-20">
        <h1 className="text-3xl font-bold mb-4">Quiz Completed!</h1>
        <p className="text-lg mb-4">
          You scored <strong>{score}</strong> out of {quiz.questions.length}
        </p>
        <Link
          href="/"
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">{quiz.title}</h1>
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">
            Question {currentIndex + 1} of {quiz.questions.length}
          </span>
          <div className="w-1/2 bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{
                width: `${((currentIndex + 1) / quiz.questions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-gray-50 shadow-sm">
          <p className="text-lg font-medium mb-4">
            {currentIndex + 1}.{" "}
            {currentQuestion.prompt || currentQuestion.question}
          </p>

          {currentQuestion.type === "mcq" && (
            <div className="space-y-2">
              {currentQuestion.options.map((opt, i) => (
                <label key={i} className="block">
                  <input
                    type="radio"
                    name={`q-${currentIndex}`}
                    value={opt}
                    checked={answers[currentIndex] === opt}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === "truefalse" && (
            <div className="space-y-2">
              {["True", "False"].map((opt, i) => (
                <label key={i} className="block">
                  <input
                    type="radio"
                    name={`q-${currentIndex}`}
                    value={opt}
                    checked={answers[currentIndex] === opt}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === "text" && (
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Type your answer..."
              value={answers[currentIndex] || ""}
              onChange={(e) => handleAnswerChange(e.target.value)}
            />
          )}
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-6 py-2 rounded font-semibold ${currentIndex === 0
              ? "bg-white-300 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
          >
            Prev
          </button>

          {currentIndex < quiz.questions.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-indigo-600 text-white px-6 py-2 rounded font-semibold hover:bg-indigo-700"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-indigo-600 text-white px-6 py-2 rounded font-semibold hover:bg-indigo-700"
            >
              Submit Quiz
            </button>
          )}
        </div>
        <div className="flex justify-center mt-6">
          <button onClick={handleCancel} className="bg-red-500 text-white px-6 py-2 rounded font-semibold hover:bg-red-600">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
