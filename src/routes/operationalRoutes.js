const express = require('express');
const router = express.Router();

const { getAllSchedules, addSchedule, updateSchedule, deleteSchedule } = require('../controllers/operationalController');

router.get('/', getAllSchedules);
router.post('/', addSchedule);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

module.exports = router;