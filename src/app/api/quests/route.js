import connectDB from '@/lib/mongodb';
import Quest from '@/models/Quest';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const quests = await Quest.find({});
    return NextResponse.json(quests);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar missões' },
      { status: 500 }
    );
  }
}
