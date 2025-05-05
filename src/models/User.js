// src/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  nickname: { 
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: [true, 'Senha é obrigatória'],
    minlength: 6,
    select: false
  },
  name: {
    type: String,
    trim: true
  },
  age: { 
    type: Number, 
    min: 13 
  },
  avatar: {
    type: String,
    default: '/default-avatar.png'
  },
  birthdate: Date,
  location: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500
  },
  favoriteGame: { 
    type: String, 
    enum: ['CS2', 'Valorant', 'LoL', 'R6', 'Apex', 'Outro'] 
  },
  socialLinks: {
    twitter: String,
    instagram: String,
    twitch: String
  },
  preferences: {
    notifications: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: false },
    publicProfile: { type: Boolean, default: true }
  },
  completedMissions: [String],
  xp: { 
    type: Number, 
    default: 0 
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
    completed: { type: Number, default: 0 },
    total: { type: Number, default: 4 }
  },
  furiaSince: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model('User', userSchema);
