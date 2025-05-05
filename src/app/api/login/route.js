import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectDB();
    const { nickname, password } = await request.json();
    
    const user = await User.findOne({ nickname }).select('+password');
    
    if (!user) {
      return NextResponse.json({ 
        message: 'Credenciais inválidas' 
      }, { status: 401 });
    }
    
    if (password !== user.password) { 
      return NextResponse.json({ 
        message: 'Credenciais inválidas' 
      }, { status: 401 });
    }

    const userData = {
      _id: user._id,
      nickname: user.nickname
    };

    return NextResponse.json({ user: userData });
    
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ 
      message: 'Falha na conexão. Tente novamente.' 
    }, { status: 500 });
  }
}
