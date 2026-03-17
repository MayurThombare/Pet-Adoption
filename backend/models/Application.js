const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: { model: 'users', key: 'id' },
  },
  petId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'pet_id',
    references: { model: 'pets', key: 'id' },
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  homeType: {
    type: DataTypes.ENUM('house', 'apartment', 'condo', 'other'),
    allowNull: true,
    field: 'home_type',
  },
  hasYard: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'has_yard',
  },
  hasOtherPets: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'has_other_pets',
  },
  otherPetsDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'other_pets_description',
  },
  hasChildren: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'has_children',
  },
  experience: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'admin_notes',
  },
  reviewedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'reviewed_at',
  },
}, {
  tableName: 'applications',
  timestamps: true,
});

module.exports = Application;
