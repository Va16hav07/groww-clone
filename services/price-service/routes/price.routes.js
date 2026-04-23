const { streamPrices, getHistory, getHistoricalData } = require('../controllers/price.controller');

const router = express.Router();

router.get('/stream', streamPrices);
router.get('/history', getHistory);
router.get('/historical', getHistoricalData);

module.exports = router;
