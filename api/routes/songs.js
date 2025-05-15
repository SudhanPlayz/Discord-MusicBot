const express = require('express');
const Song = require('../models/Song.js');

const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const { title, artist, url } = req.body;
    const song = new Song({ title, artist, url });
    await song.save();
    res.status(201).json({ success: true, song });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
//post delete a song
router.post('/delete', async (req, res) => {
  try {
    const { id } = req.body;
    const deleted = await Song.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Song not found' });
    res.json({ success: true, message: 'Song deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/queue', async (req, res) => {
  try {
    const queue = await Song.find().sort({ addedAt: 1 }); // oldest to newest
    res.json({ success: true, queue });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
