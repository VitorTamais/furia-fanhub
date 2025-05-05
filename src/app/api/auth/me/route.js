import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectDB()
    const user = await User.findOne({ nickname });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Não autenticado' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        nickname: user.nickname,
        level: user.level,
        points: user.points
      }
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erro no servidor' },
      { status: 500 }
    )
  }
}
