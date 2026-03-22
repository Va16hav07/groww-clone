const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8001;

app.use(cors());
app.use(express.json());

const marketState = {
  RELIANCE: { NSE: 1384.80, BSE: 1384.25 },
  TCS:      { NSE: 2356.00, BSE: 2355.45 },
  HDFCBANK: { NSE: 798.20,  BSE: 797.65 },
  INFY:     { NSE: 1220.80, BSE: 1220.25 }
};

setInterval(() => {
  for (const symbol in marketState) {
    const driftPercentage = (Math.random() * 0.10) - 0.05; 
    
    marketState[symbol].NSE += marketState[symbol].NSE * driftPercentage;
    marketState[symbol].BSE += marketState[symbol].BSE * driftPercentage;
  }
}, 5000);

app.get('/stock', (req, res) => {
  const symbol = req.query.name;
  
  if (!symbol) {
    return res.status(400).json({ error: "Missing symbol name query parameter" });
  }

  if (!marketState[symbol]) {
    return res.json({
      currentPrice: { NSE: 100.00, BSE: 99.50 }
    });
  }

  res.json({
    currentPrice: {
      NSE: parseFloat(marketState[symbol].NSE.toFixed(2)),
      BSE: parseFloat(marketState[symbol].BSE.toFixed(2))
    }
  });
});

app.listen(PORT, () => {
  console.log(`[Dummy Gateway] Mock Indian Stock API running on http://localhost:${PORT}`);
  console.log(`[Dummy Gateway] Prices algorithmically ticking every 5 seconds.`);
});
