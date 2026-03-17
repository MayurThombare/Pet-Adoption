const sequelize = require('../config/database');
const User = require('./User');
const Pet = require('./Pet');
const Application = require('./Application');

// Associations
User.hasMany(Application, { foreignKey: 'userId', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Pet.hasMany(Application, { foreignKey: 'petId', as: 'applications' });
Application.belongsTo(Pet, { foreignKey: 'petId', as: 'pet' });

module.exports = { sequelize, User, Pet, Application };
