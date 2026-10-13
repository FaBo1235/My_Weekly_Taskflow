const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')
const { breakdownTask } = require('../controllers/aiController')

router.post(
  '/breakdown',
  authMiddleware,
  breakdownTask
)

module.exports = router