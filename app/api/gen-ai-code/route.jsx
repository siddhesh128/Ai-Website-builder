import { GenAiCode } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export const maxDuration = 60; // Reduced to 60 seconds for hobby plan
export const dynamic = 'force-dynamic';

export async function POST(req) {
    const {prompt} = await req.json();

    try {
        const result = await Promise.race([
            GenAiCode.sendMessage(prompt),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timeout')), 55000)
            )
        ]);

        const resp = result.response.text();
        return NextResponse.json(JSON.parse(resp));
        
    } catch (error) {
        console.log(error);
        return NextResponse.error({error});
    }
}