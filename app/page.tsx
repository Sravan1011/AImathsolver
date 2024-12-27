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
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <header className="w-full flex items-center justify-between bg-white shadow-md p-4">
                <h1 className="text-lg font-bold">Coding Tutor AI</h1>
                <img
                    src="/profile.jpg" // Replace this with the actual profile image URL
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                />
            </header>

            {/* Content */}
            <div className="flex flex-col md:flex-row items-start p-6 space-y-6 md:space-y-0 md:space-x-6">
                {/* Left Panel - Problem and Input */}
                <div className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                        <RiQuestionnaireFill className="text-blue-500" /> AI Math Solver
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Enter your math problem below and let the AI solve it for you!
                    </p>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            className="border rounded-md p-3 w-full mb-4"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Type your math problem here..."
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600"
                            disabled={loading}
                        >
                            {loading ? "Solving..." : "Solve"}
                        </button>
                    </form>
                </div>

                {/* Middle Panel - Solution */}
                <div className="w-full md:w-2/3 bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Solution</h2>
                    <div className="border rounded-md p-4 bg-gray-50">
                        {solution ? (
                            <p className="text-gray-800">{solution}</p>
                        ) : (
                            <p className="text-gray-500">The solution will appear here...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
