const express = require('express');
const router = express.Router();

const { getAllSchedules, addSchedule, updateSchedule, deleteSchedule, getOperationalHourById } = require('../controllers/operationalController');

router.get('/', getAllSchedules);
router.post('/', addSchedule);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);
router.get('/:id', getOperationalHourById);
module.exports = router;