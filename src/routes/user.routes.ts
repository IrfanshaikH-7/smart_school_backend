import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth'; // Import auth middleware

const router = Router();

// Public route for creating a user (e.g., for admin to create users, or for self-registration if allowed)
// Note: Actual user registration is handled by auth.routes.ts
router.post('/', userController.createUser);

// Routes requiring authentication and authorization
router.get('/', authenticate, authorize(['admin']), userController.getAllUsers);
router.get('/:id', authenticate, authorize(['admin', 'teacher', 'parent']), userController.getUserById);
router.put('/:id', authenticate, authorize(['admin']), userController.updateUser); // Admin can update any user
router.delete('/:id', authenticate, authorize(['admin']), userController.deleteUser);

// Example of a user-specific route where a user can update their own profile
// router.put('/me', authenticate, userController.updateCurrentUser); // Requires a separate controller method

export default router;