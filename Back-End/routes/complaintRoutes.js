const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { auth, authorize } = require('../middleware/authMiddleware');//
const contentFilterMiddleware = require('../middleware/contentFilterMiddleware');

router.use(auth); // 

router.post('/submit', contentFilterMiddleware, complaintController.submitComplaint);
router.get('/', complaintController.getComplaints);
router.patch('/:complaintId/moderate', authorize(['boardMember', 'moderator']), complaintController.moderateComplaint);
router.post('/:complaintId/reveal-identity', authorize(['boardMember']), complaintController.requestIdentityReveal);

module.exports = router;
