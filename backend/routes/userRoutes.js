const express = require('express');
const { body, param } = require('express-validator');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');

const router = express.Router();

const userCreateValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['ADMIN', 'HOD', 'FACULTY', 'STUDENT']).withMessage('Role must be ADMIN, HOD, FACULTY, or STUDENT'),
  body('departmentId').optional({ nullable: true }).isInt({ min: 1 }).withMessage('Department id must be valid'),
];

const userUpdateValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').optional().trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['ADMIN', 'HOD', 'FACULTY', 'STUDENT']).withMessage('Role must be ADMIN, HOD, FACULTY, or STUDENT'),
  body('departmentId').optional({ nullable: true }).isInt({ min: 1 }).withMessage('Department id must be valid'),
  body('isActive').optional().isIn([0, 1, '0', '1']).withMessage('isActive must be 0 or 1'),
];

router.get('/', authenticate, authorize('admin'), getUsers);
router.post('/', authenticate, authorize('admin'), userCreateValidation, validateRequest, createUser);
router.put('/:id', authenticate, authorize('admin'), param('id').isInt({ min: 1 }), userUpdateValidation, validateRequest, updateUser);
router.delete('/:id', authenticate, authorize('admin'), param('id').isInt({ min: 1 }), validateRequest, deleteUser);

module.exports = router;
