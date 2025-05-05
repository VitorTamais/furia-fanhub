import { NextResponse } from 'next/server'

export async function POST() {
  try {
    return NextResponse.json({ 
      success: true, 
      message: 'Logout realizado com sucesso' 
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erro no logout' },
      { status: 500 }
    )
  }
}
