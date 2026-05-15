const router  = require('express').Router();
const rateLimit = require('express-rate-limit');
const { submitContact, getMessages } = require('../controllers/contactController');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many requests. Please wait 15 minutes.' }
});

router.post('/',        limiter, submitContact);
router.get('/messages', getMessages);

module.exports = router;
