"use client";
import axios from "axios";
import { useState, useEffect } from "react";

export default function AdminPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", type: "mcq", options: ["", ""], correctAnswer: "" },
  ]);
  const [editingQuiz, setEditingQuiz] = useState(null);

  // ✅ Fetch existing quizzes
  const fetchQuizzes = async () => {
    const res = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/quizzes');
    console.log("res", res);
    setQuizzes(res.data);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // ✅ Handle question change
  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  // ✅ Handle MCQ option change
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  // ✅ Add new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", type: "mcq", options: ["", ""], correctAnswer: "" },
    ]);
  };

  // ✅ Remove question
  const removeQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  // ✅ Submit quiz (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { title, questions };
    try {
      const url = editingQuiz
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${editingQuiz._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes`;

      if (editingQuiz) {
        await axios.put(url, payload, {
          headers: { "Content-Type": "application/json" },
          withCredentials: false, // ensure no cookies (prevents some CORS issues)
        });
        alert("Quiz updated!");
      } else {
        await axios.post(url, payload, {
          headers: { "Content-Type": "application/json" },
          withCredentials: false,
        });
        alert("Quiz created!");
      }

      // ✅ Reset form
      setTitle("");
      setQuestions([{ question: "", type: "mcq", options: ["", ""], correctAnswer: "" }]);
      setEditingQuiz(null);

      // ✅ Refresh quizzes list
      fetchQuizzes();

    } catch (err) {
      console.error("Error submitting quiz:", err.response?.data || err.message);
      alert("Failed to submit quiz. Check console for details.");
    }
  };


  // ✅ Delete quiz
  const deleteQuiz = async (id) => {
    if (!confirm("Delete this quiz?")) return;
    //DELETE request
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${id}`
    );
    fetchQuizzes();
  };

  // ✅ Edit quiz
  const editQuiz = (quiz) => {
    setEditingQuiz(quiz);
    setTitle(quiz.title);
    setQuestions(quiz.questions);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Quiz Manager</h1>

      {/* ✅ Create / Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded-lg mb-12">
        <div className="mb-4">
          <label className="block font-semibold mb-2">Quiz Title</label>
          <input
            type="text"
            className="border border-gray-300 p-2 rounded w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <h2 className="text-xl font-semibold mb-4">Questions</h2>

        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="border border-gray-200 p-4 rounded-lg mb-4 bg-gray-50"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Question {qIndex + 1}</span>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              )}
            </div>

            <input
              type="text"
              placeholder="Enter question..."
              className="border border-gray-300 p-2 rounded w-full mb-3"
              value={q.question}
              onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
              required
            />

            <div className="mb-3">
              <label className="font-medium mr-2">Type:</label>
              <select
                className="border border-gray-300 p-2 rounded"
                value={q.type}
                onChange={(e) => handleQuestionChange(qIndex, "type", e.target.value)}
              >
                <option value="mcq">MCQ</option>
                <option value="truefalse">True/False</option>
                <option value="text">Text</option>
              </select>
            </div>

            {/* ✅ MCQ Options */}
            {q.type === "mcq" && (
              <div className="space-y-2 mb-3">
                {q.options.map((opt, optIndex) => (
                  <input
                    key={optIndex}
                    type="text"
                    placeholder={`Option ${optIndex + 1}`}
                    className="border border-gray-300 p-2 rounded w-full"
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(qIndex, optIndex, e.target.value)
                    }
                  />
                ))}
                <button
                  type="button"
                  onClick={() =>
                    handleQuestionChange(qIndex, "options", [...q.options, ""])
                  }
                  className="text-sm text-indigo-600"
                >
                  + Add Option
                </button>
              </div>
            )}

            <input
              type="text"
              placeholder="Correct answer"
              className="border border-gray-300 p-2 rounded w-full"
              value={q.correctAnswer}
              onChange={(e) =>
                handleQuestionChange(qIndex, "correctAnswer", e.target.value)
              }
              required
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="mt-3 text-indigo-600 text-sm font-semibold"
        >
          + Add Another Question
        </button>

        <div className="mt-6">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded font-semibold hover:bg-indigo-700"
          >
            {editingQuiz ? "Update Quiz" : "Create Quiz"}
          </button>
        </div>
      </form>

      {/* ✅ Quiz List */}
      <h2 className="text-2xl font-semibold mb-4">Existing Quizzes</h2>
      {quizzes.length === 0 ? (
        <p className="text-gray-500">No quizzes yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="border p-4 rounded-lg bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-2">{quiz.title}</h3>
              <p className="text-sm text-gray-500 mb-4">
                {quiz.questions.length} Questions
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => editQuiz(quiz)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteQuiz(quiz._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
