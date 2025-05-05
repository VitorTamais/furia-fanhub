import connectDB from '@/lib/mongodb';
import UserData from '@/models/UserData';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    
    const existingUser = await UserData.findOne({ userId: data.userId });
    
    if (existingUser) {
      return NextResponse.json(
        { message: 'Usuário já existe' },
        { status: 400 }
      );
    }
    
    const newUserData = new UserData(data);
    await newUserData.save();
    
    return NextResponse.json(newUserData, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar dados do usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao criar dados do usuário' },
      { status: 500 }
    );
  }
}
