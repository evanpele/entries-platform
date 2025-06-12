require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Συνδεθήκαμε στη MongoDB'))
.catch(err => console.error(err));

const entrySchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  tags: [String],
  created_at: { type: Date, default: Date.now }
});

const Entry = mongoose.model('Entry', entrySchema);

app.post('/entries', async (req, res) => {
  try {
    const entry = new Entry(req.body);
    await entry.save();
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/entries', async (req, res) => {
  try {
    const { category, q } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (q) filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } }
    ];

    const entries = await Entry.find(filter).sort({ created_at: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
