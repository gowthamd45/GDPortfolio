const router = require('express').Router();
const { getAll, getSection } = require('../controllers/portfolioController');

router.get('/',          getAll);
router.get('/:section',  getSection);

module.exports = router;
