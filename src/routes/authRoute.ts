import express  from "express";
import userController from "../controllers/userCtrl"
import middleware from "../middleware/authMiddleware"

const router= express.Router();

router.post('/register', userController.createUser);
router.post('/login', userController.loginUserCtrl);
router.get('/all-users', userController.getAllUser);
router.get('/:id', middleware.authMiddleware, middleware.isAdmin, userController.getUser);
router.get('/refresh', userController.handleRefreshToken)
router.get('/logout', userController.logout)
router.delete('/:id', userController.deleteUser);
router.put('/edit-user', middleware.authMiddleware, userController.updateUser)
router.put('/block-user/:id', middleware.authMiddleware,middleware.isAdmin, userController.blockUser)
router.put('/unblock-user/:id', middleware.authMiddleware, middleware.isAdmin, userController.unblockUser)


export default router 