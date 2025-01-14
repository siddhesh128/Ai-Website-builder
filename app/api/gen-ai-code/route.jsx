import { GenAiCode } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export const maxDuration = 300; 
export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        const { prompt } = await req.json();
        
        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        const result = await Promise.race([
            GenAiCode.sendMessage(prompt),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timeout')), 280000)
            )
        ]);

        const response = await result.response;
        const text = await response.text();
        
        return NextResponse.json(
            { result: JSON.parse(text) },
            { status: 200 }
        );
        
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: error.name === 'TimeoutError' ? 504 : 500 }
        );
    }
}