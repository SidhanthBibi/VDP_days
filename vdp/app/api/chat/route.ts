// app/api/chat/route.ts
import { NextResponse } from 'next/server';

const messages: { id: number; text: string; user: string }[] = []; // Use const instead of let

export async function GET() {
    return NextResponse.json(messages);
}

export async function POST(request: Request) {
    const { text, user } = await request.json();
    const message = { id: Date.now(), text, user };
    messages.push(message);

    // Broadcast to other clients (real-time)
    return NextResponse.json(message);
}
