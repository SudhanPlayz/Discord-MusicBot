

import mongoose from 'mongoose';

const SongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String },
  url: { type: String, required: true },
  addedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Song', SongSchema);
