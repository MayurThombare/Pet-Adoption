const { body } = require('express-validator');

const registerValidator = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
];

const loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

const petValidator = [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Pet name required'),
  body('species')
    .isIn(['dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'reptile', 'other'])
    .withMessage('Valid species required'),
  body('age').isFloat({ min: 0, max: 100 }).withMessage('Age must be between 0 and 100'),
  body('ageUnit').optional().isIn(['months', 'years']).withMessage('Age unit must be months or years'),
  body('gender').optional().isIn(['male', 'female', 'unknown']),
  body('size').optional().isIn(['small', 'medium', 'large', 'extra-large']),
  body('status').optional().isIn(['available', 'pending', 'adopted']),
];

const applicationValidator = [
  body('petId').isUUID().withMessage('Valid pet ID required'),
  body('message').optional().isLength({ max: 1000 }).withMessage('Message too long'),
  body('homeType').optional().isIn(['house', 'apartment', 'condo', 'other']),
  body('hasYard').optional().isBoolean(),
  body('hasOtherPets').optional().isBoolean(),
  body('hasChildren').optional().isBoolean(),
  body('experience').optional().isLength({ max: 1000 }),
];

const profileValidator = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
  body('address').optional().isLength({ max: 500 }),
];

module.exports = { registerValidator, loginValidator, petValidator, applicationValidator, profileValidator };
