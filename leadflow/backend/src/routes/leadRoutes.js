const express = require('express');
const router = express.Router();
const {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  getStats,
  bulkUpdateStatus,
} = require('../controllers/leadController');

// Stats route MUST be before /:id to avoid param conflict
router.get('/stats', getStats);
router.patch('/bulk-status', bulkUpdateStatus);

router.route('/').get(getLeads).post(createLead);
router.route('/:id').get(getLead).put(updateLead).delete(deleteLead);

module.exports = router;
