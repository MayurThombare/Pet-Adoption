const express = require('express');
const router = express.Router();
const { getPets, getPet, createPet, updatePet, deletePet, updatePetStatus } = require('../controllers/petController');
const { authenticate, authorize } = require('../middleware/auth');
const { petValidator } = require('../validators');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getPets);
router.get('/:id', getPet);

// Admin routes
router.post('/', authenticate, authorize('admin'), upload.single('photo'), petValidator, createPet);
router.put('/:id', authenticate, authorize('admin'), upload.single('photo'), petValidator, updatePet);
router.delete('/:id', authenticate, authorize('admin'), deletePet);
router.patch('/:id/status', authenticate, authorize('admin'), updatePetStatus);

module.exports = router;
