'use client'
import { useState, useEffect } from 'react'
import axios from 'axios';

const AdminPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [questions, setQuestions] = useState([
        { type: "mcq", options: ["", ""], question: "", correctAnswer: "" },
    ]);
    const [title, setTitle] = useState("");

    const fetchQuizzes = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes`);
            setQuizzes(res.data);
        } catch (error) {
            console.error("Error fetching quizzes:", error);
        }
    };
    useEffect(() => {
        fetchQuizzes();
    }, []);

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    }

    const handleOptionChange = (qIndex, optIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options[optIndex] = value;
        setQuestions(updatedQuestions);
    }

    const addQuestion = () => {
        setQuestions([...questions, { type: "mcq", options: ["", ""], question: "", correctAnswer: "" }]);
    }

    const removeQuestion = (index) => {
        const updated = [...questions];
        updated.splice(index, 1);
        setQuestions(updated);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { title, questions };
        try {
            const url = editingQuiz ?
                `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${editingQuiz._id}` :
                `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes`;

            if (editingQuiz) {
                await axios.put(url, payload);
                alert("Quiz updated successfully!");
            } else {
                await axios.post(url, payload);
                alert("Quiz created successfully!");
            }
            setTitle("");
            setQuestions([{ type: "mcq", options: ["", ""], question: "", correctAnswer: "" }]);
            setEditingQuiz(null);
            fetchQuizzes();
        } catch (error) {
            console.error("Error saving quiz:", error);
        }
    }

    const addQuiz = (quiz) => {
        setEditingQuiz(quiz);
        setTitle(quiz.title);
        setQuestions(quiz.questions);
    }

    const deleteQuiz = async (quizId) => {
        if (!confirm("Are you sure you want to delete this quiz?")) return;

        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${quizId}`);
        fetchQuizzes();
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

            <form onSubmit={handleSubmit} className="mb-12 bg-white p-6 rounded-lg shadow">
                <div className="mb-4">
                    <label>
                        Quiz Title:
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border border-gray-300 p-2 rounded w-full"
                    />
                </div>

                <h2 className="text-2xl font-semibold mb-4">Questions</h2>
                {
                    questions.map((q, index) => (
                        <div key={index} className="mb-4 border bg-gray-50 border-gray-200 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <span>Question {index + 1}</span>
                                {
                                    questions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(index)}
                                            className="text-red-500 text-sm"
                                        >
                                            Remove
                                        </button>
                                    )
                                }
                            </div>


                            <label>
                                Question:
                            </label>
                            <input
                                type="text"
                                placeholder="Enter question text"
                                value={q.question}
                                onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                                required
                                className="border border-gray-300 p-2 rounded w-full mb-3"
                            />

                            <div className="mb-3">
                                <label className="mr-2">
                                    Type:
                                </label>
                                <select
                                    value={q.type}
                                    onChange={(e) => handleQuestionChange(index, "type", e.target.value)}
                                    className="border border-gray-300 p-2 rounded"
                                >
                                    <option value="mcq">Multiple Choice</option>
                                    <option value="text">Text</option>
                                    <option value="truefalse">True/False</option>
                                </select>
                            </div>
                            {q.type === "mcq" && (
                                <div className="spaces-y-2 mb-3">
                                    {q.options.map((opt, optIndex) => (
                                        <input
                                            key={optIndex}
                                            type="text"
                                            placeholder={`Option ${optIndex + 1}`}
                                            value={opt}
                                            onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                                            className="border border-gray-300 p-2 rounded-lg w-full mb-1"
                                        />
                                    ))}
                                    <button type="button" onClick={() => handleQuestionChange(index, "options", [...q.options, ""])} className="text-indigo-500 text-sm">
                                        + Add Option
                                    </button>
                                </div>
                            )}
                            <input
                                type="text"
                                placeholder="Correct Answer"
                                value={q.correctAnswer}
                                onChange={(e) => handleQuestionChange(index, "correctAnswer", e.target.value)}
                                required
                                className="border border-gray-300 p-2 rounded-lg w-full mb-1"
                            />
                        </div>
                    ))
                }
                <button type="button" onClick={addQuestion} className="mt-3 text-indigo-600 text-sm">
                    + Add Another Question
                </button>

                <div className="mt-6">
                    <button type="submit" className="bg-indigo-600 text-white px-6 font-semibold py-2 rounded hover:bg-indigo-700">
                        {editingQuiz ? "Update Quiz" : "Create Quiz"}
                    </button>
                </div>
            </form>

            <h2 className="text-2xl font-semibold mb-4">Existing Quizzes</h2>
            {quizzes.length === 0 ? (
                <p>No quizzes available.</p>
            ) : (
                <div>
                    {quizzes.map((quiz) => (
                        <div key={quiz._id} className="border p-4 mb-4 bg-white shadow-sm rounded-xl transition hover:shadow-lg">
                            <h3 className="text-lg font-semibold mb-2">{quiz.title}</h3>
                            <p className="text-gray-600">{quiz.questions.length} Questions</p>
                            <div className="mt-2">
                                <button onClick={() => addQuiz(quiz)} className="bg-blue-500 text-white px-3 py-1 mr-2 rounded text-sm hover:bg-blue-600">
                                    Edit
                                </button>
                                <button onClick={() => deleteQuiz(quiz._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AdminPage