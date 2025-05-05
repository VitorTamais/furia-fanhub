import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    if (!body.password) {
      return NextResponse.json({ 
        success: false, 
        message: 'Senha é obrigatória' 
      }, { status: 400 });
    }

    const newUser = await User.create(body);
    
    return NextResponse.json({ 
      success: true, 
      user: newUser 
    }, { status: 201 });

  } catch (error) {
    console.error('Erro no registro:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao criar usuário' 
    }, { status: 500 });
  }
}