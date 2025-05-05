import mongoose from 'mongoose';

const UserDataSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  nickname: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    default: 1
  },
  points: {
    type: Number,
    default: 0
  },
  nextLevel: {
    type: Number,
    default: 100
  },
  quests: {
    completed: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 4
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.UserData || mongoose.model('UserData', UserDataSchema);
