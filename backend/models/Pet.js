const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pet = sequelize.define('Pet', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { len: [1, 100] },
  },
  species: {
    type: DataTypes.ENUM('dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'reptile', 'other'),
    allowNull: false,
  },
  breed: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  age: {
    type: DataTypes.DECIMAL(4, 1),
    allowNull: false,
    validate: { min: 0, max: 100 },
  },
  ageUnit: {
    type: DataTypes.ENUM('months', 'years'),
    defaultValue: 'years',
    field: 'age_unit',
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'unknown'),
    defaultValue: 'unknown',
  },
  size: {
    type: DataTypes.ENUM('small', 'medium', 'large', 'extra-large'),
    defaultValue: 'medium',
  },
  color: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('available', 'pending', 'adopted'),
    defaultValue: 'available',
  },
  photoUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'photo_url',
  },
  vaccinated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  neutered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  healthNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'health_notes',
  },
}, {
  tableName: 'pets',
  timestamps: true,
});

module.exports = Pet;
