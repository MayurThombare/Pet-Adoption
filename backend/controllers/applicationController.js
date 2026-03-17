const { validationResult } = require('express-validator');
const { Application, Pet, User } = require('../models');

const createApplication = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { petId, message, homeType, hasYard, hasOtherPets, otherPetsDescription, hasChildren, experience } = req.body;

    // Check pet exists and is available
    const pet = await Pet.findByPk(petId);
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }
    if (pet.status !== 'available') {
      return res.status(400).json({ success: false, message: 'This pet is not available for adoption' });
    }

    // Check user hasn't already applied for this pet
    const existingApp = await Application.findOne({
      where: { userId: req.user.id, petId, status: ['pending', 'approved'] },
    });
    if (existingApp) {
      return res.status(409).json({ success: false, message: 'You have already applied to adopt this pet' });
    }

    const application = await Application.create({
      userId: req.user.id,
      petId,
      message,
      homeType,
      hasYard,
      hasOtherPets,
      otherPetsDescription,
      hasChildren,
      experience,
    });

    // Update pet status to pending
    await pet.update({ status: 'pending' });

    const fullApplication = await Application.findByPk(application.id, {
      include: [
        { model: Pet, as: 'pet' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: { application: fullApplication },
    });
  } catch (error) {
    next(error);
  }
};

const getMyApplications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const where = { userId: req.user.id };
    if (status) where.status = status;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows: applications } = await Application.findAndCountAll({
      where,
      include: [{ model: Pet, as: 'pet' }],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        applications,
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

const getApplication = async (req, res, next) => {
  try {
    const application = await Application.findByPk(req.params.id, {
      include: [
        { model: Pet, as: 'pet' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
      ],
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Users can only view their own; admins can view all
    if (req.user.role !== 'admin' && application.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, data: { application } });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all applications
const getAllApplications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, petId } = req.query;
    const where = {};
    if (status) where.status = status;
    if (petId) where.petId = petId;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows: applications } = await Application.findAndCountAll({
      where,
      include: [
        { model: Pet, as: 'pet' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
      ],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        applications,
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

// Admin: Review application
const reviewApplication = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved or rejected' });
    }

    const application = await Application.findByPk(req.params.id, {
      include: [{ model: Pet, as: 'pet' }],
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending applications can be reviewed' });
    }

    await application.update({ status, adminNotes, reviewedAt: new Date() });

    // Update pet status based on decision
    if (status === 'approved') {
      await application.pet.update({ status: 'adopted' });

      // Reject all other pending applications for this pet
      await Application.update(
        { status: 'rejected', adminNotes: 'Another application was approved for this pet.' },
        { where: { petId: application.petId, status: 'pending', id: { [require('sequelize').Op.ne]: application.id } } }
      );
    } else if (status === 'rejected') {
      // Check if there are other pending apps, if not make pet available again
      const pendingCount = await Application.count({
        where: { petId: application.petId, status: 'pending' },
      });
      if (pendingCount === 0) {
        await application.pet.update({ status: 'available' });
      }
    }

    res.json({ success: true, message: `Application ${status}`, data: { application } });
  } catch (error) {
    next(error);
  }
};

module.exports = { createApplication, getMyApplications, getApplication, getAllApplications, reviewApplication };
