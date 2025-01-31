const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');

// Define routes for club-related actions
router.post('/', clubController.createClub); // Create a new club
router.get('/', clubController.getAllClubs); // Retrieve all clubs
router.get('/:id', clubController.getClubById); // Retrieve a specific club by ID
router.put('/:id', clubController.updateClub); // Update a specific club by ID
router.delete('/:id', clubController.deleteClub); // Delete a specific club by ID

module.exports = router;