const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static('public'));
app.use(express.json());

// Terpene data with properties for visual synthesis
const terpenes = {
  pinene: {
    name: 'α-Pinene',
    molecular: 'C₁₀H₁₆',
    scent: 'Pine, earthy, fresh',
    color: '#2D5016',
    frequency: 528,
    effects: ['Alertness', 'Memory retention', 'Focus']
  },
  limonene: {
    name: 'Limonene',
    molecular: 'C₁₀H₁₆',
    scent: 'Citrus, lemon, orange',
    color: '#FFB300',
    frequency: 639,
    effects: ['Uplifting', 'Stress relief', 'Mood elevation']
  },
  myrcene: {
    name: 'Myrcene',
    molecular: 'C₁₀H₁₆',
    scent: 'Earthy, musky, herbal',
    color: '#654321',
    frequency: 396,
    effects: ['Relaxation', 'Sedation', 'Muscle tension relief']
  },
  linalool: {
    name: 'Linalool',
    molecular: 'C₁₀H₁₈O',
    scent: 'Floral, lavender, sweet',
    color: '#9B7EBD',
    frequency: 852,
    effects: ['Calming', 'Anti-anxiety', 'Sleep aid']
  },
  caryophyllene: {
    name: 'β-Caryophyllene',
    molecular: 'C₁₅H₂₄',
    scent: 'Spicy, peppery, woody',
    color: '#8B4513',
    frequency: 417,
    effects: ['Anti-inflammatory', 'Pain relief', 'Stress reduction']
  },
  humulene: {
    name: 'Humulene',
    molecular: 'C₁₅H₂₄',
    scent: 'Earthy, woody, hoppy',
    color: '#CD853F',
    frequency: 741,
    effects: ['Appetite suppression', 'Anti-inflammatory', 'Antibacterial']
  }
};

// API endpoint to get terpene data
app.get('/api/terpenes', (req, res) => {
  res.json(terpenes);
});

// API endpoint to get specific terpene
app.get('/api/terpenes/:name', (req, res) => {
  const terpene = terpenes[req.params.name.toLowerCase()];
  if (terpene) {
    res.json(terpene);
  } else {
    res.status(404).json({ error: 'Terpene not found' });
  }
});

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌲 Terpene2Images server running on http://localhost:${PORT}`);
  console.log(`✨ Soul of Dissonance - Visual & Audio Synthesis`);
});
