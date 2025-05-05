// src/models/Quest.js
import mongoose from 'mongoose';

const questSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['quiz', 'social', 'profile', 'media']
  },
  xp: { type: Number, required: true },
  config: mongoose.Schema.Types.Mixed
});

export default mongoose.models.Quest || mongoose.model('Quest', questSchema);
