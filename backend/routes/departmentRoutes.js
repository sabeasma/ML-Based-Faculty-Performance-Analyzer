const express = require('express');
const { body, param } = require('express-validator');
const { getDepartments, createDepartment, updateDepartment, deleteDepartment } = require('../controllers/departmentController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');

const router = express.Router();

const departmentBodyValidation = [
  body('name').trim().notEmpty().withMessage('Department name is required'),
  body('hod').optional({ nullable: true }).isInt({ min: 1 }).withMessage('HOD must be a valid user id'),
];

router.get('/', authenticate, authorize('admin', 'hod'), getDepartments);
router.post('/', authenticate, authorize('admin'), departmentBodyValidation, validateRequest, createDepartment);
router.put('/:id', authenticate, authorize('admin'), param('id').isInt({ min: 1 }), departmentBodyValidation, validateRequest, updateDepartment);
router.delete('/:id', authenticate, authorize('admin'), param('id').isInt({ min: 1 }), validateRequest, deleteDepartment);

module.exports = router;
