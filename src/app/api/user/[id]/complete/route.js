import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { missionId, xp } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      {
        $addToSet: { completedMissions: missionId },
        $inc: { xp: xp }
      },
      { new: true }
    );

    return NextResponse.json({
      _id: updatedUser._id,
      xp: updatedUser.xp,
      level: Math.floor(updatedUser.xp / 1000) + 1,
      completedMissions: updatedUser.completedMissions
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar' },
      { status: 500 }
    );
  }
}
