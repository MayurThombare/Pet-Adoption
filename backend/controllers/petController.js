const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const { Pet } = require('../models');

const getPets = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      species,
      breed,
      age,
      status = 'available',
      sort = 'createdAt',
      order = 'DESC',
    } = req.query;

    const where = {};

    if (status) where.status = status;
    if (species) where.species = species;
    if (breed) where.breed = { [Op.iLike]: `%${breed}%` };

    if (age) {
      const [min, max] = age.split('-').map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        where.age = { [Op.between]: [min, max] };
      }
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { breed: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const allowedSorts = ['name', 'age', 'createdAt', 'species'];
    const sortField = allowedSorts.includes(sort) ? sort : 'createdAt';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows: pets } = await Pet.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[sortField, sortOrder]],
    });

    res.json({
      success: true,
      data: {
        pets,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getPet = async (req, res, next) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }
    res.json({ success: true, data: { pet } });
  } catch (error) {
    next(error);
  }
};

const createPet = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    let photoUrl = req.body.photoUrl || null;
    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    }

    const pet = await Pet.create({ ...req.body, photoUrl });
    res.status(201).json({ success: true, message: 'Pet created', data: { pet } });
  } catch (error) {
    next(error);
  }
};

const updatePet = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const pet = await Pet.findByPk(req.params.id);
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    let photoUrl = req.body.photoUrl || pet.photoUrl;
    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    }

    await pet.update({ ...req.body, photoUrl });
    res.json({ success: true, message: 'Pet updated', data: { pet } });
  } catch (error) {
    next(error);
  }
};

const deletePet = async (req, res, next) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    await pet.destroy();
    res.json({ success: true, message: 'Pet deleted' });
  } catch (error) {
    next(error);
  }
};

const updatePetStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['available', 'pending', 'adopted'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const pet = await Pet.findByPk(req.params.id);
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    await pet.update({ status });
    res.json({ success: true, message: 'Pet status updated', data: { pet } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPets, getPet, createPet, updatePet, deletePet, updatePetStatus };
