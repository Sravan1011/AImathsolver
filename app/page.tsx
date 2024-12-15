"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { RiQuestionnaireFill } from "react-icons/ri";

export default function Home() {
    const [question, setQuestion] = useState<string>("");
    const [solution, setSolution] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let requestBody: { question?: string; image?: string };

            if (uploadedImage) {
                requestBody = { image: uploadedImage };
            } else {
                requestBody = { question };
            }

            const res = await fetch("/api/solve", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            const data = await res.json();
            if (data.solution) {
                setSolution(data.solution);
            } else {
                setSolution("Error solving the problem.");
            }
        } catch (error) {
            console.error(error);
            setSolution("Error connecting to the server.");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setUploadedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50 p-6 relative">
            <div
                className="absolute inset-0 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 bg-opacity-10 pointer-events-none"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                }}
            ></div>

            <h1 className="text-4xl font-bold mb-8 z-10">AI Math Solver</h1>
            <div className="flex flex-row w-full max-w-5xl gap-4 z-10">
                <div className="w-1/2 bg-white shadow-md rounded-lg p-5">
                    <h2 className="text-2xl font-semibold mb-2">Enter Your Question</h2>
                    <RiQuestionnaireFill />
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <textarea
                            className="border rounded-md p-2 w-full h-28"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Type your math problem here..."
                        />
                        <div className="flex items-center gap-4">
                            <label
                                htmlFor="fileUpload"
                                className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            >
                                Upload Image
                            </label>
                            <input
                                id="fileUpload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            {uploadedImage && (
                                <p className="text-green-500">Image uploaded!</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            disabled={loading}
                        >
                            {loading ? "Solving..." : "Solve"}
                        </button>
                    </form>
                </div>
                <div className="w-1/2 bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Solution</h2>
                    <div className="border rounded-md p-4 bg-gray-100 h-80 overflow-y-auto">
                        {solution ? (
                            <p>{solution}</p>
                        ) : (
                            <p className="text-gray-500">
                                The solution will appear here...
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
