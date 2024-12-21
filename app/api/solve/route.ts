import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const body = await req.json(); 
    const { question } = body;

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(question);

    if (result?.response?.text) {
      return NextResponse.json({ solution: result.response.text }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Failed to generate solution." }, { status: 500 });
    }
  } catch (error) {
    console.error("Error connecting to Gemini API:", error);
    return NextResponse.json(
      { error: "Error connecting to the Gemini API." },
      { status: 500 }
    );
  }
}
