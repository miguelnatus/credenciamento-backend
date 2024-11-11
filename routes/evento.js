const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');

router.post('/', eventoController.createEvent);
router.get('/', eventoController.getAllEvents);
router.get('/:id', eventoController.getEventById);
router.put('/:id', eventoController.updateEvent);
router.delete('/:id', eventoController.deleteEvent);

module.exports = router;