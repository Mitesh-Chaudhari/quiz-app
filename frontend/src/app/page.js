'use client'
import {useState, useEffect} from 'react'
import axios from 'axios';
import Link from 'next/link';

const Home = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(()=> {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes`);
        setQuizzes(res.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <>
      <div className="main-h-screen p-6 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6">
          Available Quizzes
        </h1>
        {
          quizzes.length === 0 ? (
            <p className="mt-4">No quizzes available.</p>
          ):(
            <div className="">
              {quizzes.map((quiz) => (
                <div key={quiz._id} className="border p-4 mb-4 bg-white rounded-xl transition hover:shadow-lg">
                  <h2 className="text-xl font-semibold">Quiz Title : {quiz.title}</h2>
                  <p className="mt-2">{quiz.description}</p>
                  <Link href={`/quiz/${quiz._id}`} className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Take Quiz
                  </Link>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </>
  )
}

export default Home