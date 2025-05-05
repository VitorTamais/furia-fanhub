import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function PUT(request) {
  try {
    await connectDB();
    const { userId, ...updateData } = await request.json();

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    const updatedData = {
      ...updateData,
      email: existingUser.email 
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatedData,
      { 
        new: true,
        runValidators: true,
        context: 'query' 
      }
    );

    return NextResponse.json({
      success: true,
      user: updatedUser
    });

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
