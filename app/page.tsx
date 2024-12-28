"use client";
import { useState, FormEvent } from "react";
import { RiQuestionnaireFill } from "react-icons/ri";

export default function Home() {
    const [question, setQuestion] = useState<string>("");
    const [solution, setSolution] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/solve", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question }),
            });

            if (!res.ok) {
                throw new Error("Failed to get a response from OpenAI API.");
            }

            const data = await res.json();
            if (data.solution) {
                setSolution(data.solution);
            } else {
                setSolution("Unable to solve the problem.");
            }
        } catch (error) {
            console.error(error);
            setSolution("Error connecting to the OpenAI API.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 flex flex-col items-center py-10">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600">Coding Tutor AI</h1>
        </header>
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-1/2">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Ask a Question</h2>
            <textarea
              className="w-full h-28 p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Type your question..."
            ></textarea>
            <button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition">
              Solve
            </button>
            <div className="mt-6">
              <label className="block mb-2 text-gray-600 font-medium">Upload or Capture Image</label>
              <input type="file" className="mb-4 block w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-300 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100" />
              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                Take a Photo
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-1/2">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Solution</h2>
            <div className="h-28 bg-gray-100 border rounded-md flex items-center justify-center text-gray-400">
              The solution will appear here...
            </div>
          </div>
        </div>
      </div>
      
    );
}
