import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { question } = await req.json();

        if (!question) {
            return NextResponse.json(
                { message: "Question is required." },
                { status: 400 }
            );
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // More cost-effective than text-davinci-003
            messages: [
                {
                    role: "system",
                    content: "You are a helpful math tutor. Solve the problem and show your work step by step."
                },
                {
                    role: "user",
                    content: `Solve this math problem: ${question}`
                }
            ],
            max_tokens: 500
        });

        const solution = response.choices[0]?.message.content || "No solution found.";

        return NextResponse.json({ solution });
    } catch (error) {
        console.error("Error connecting to OpenAI API:", error);
        return NextResponse.json(
            { message: "Error connecting to OpenAI API." },
            { status: 500 }
        );
    }
}