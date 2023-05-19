import express  from "express";
import userController from "../controllers/userCtrl"
const router= express.Router();

router.post('/register', userController.createUser);
router.post('/login', userController.loginUserCtrl);
router.get('/all-users', userController.getAllUser);
router.get('/:id', userController.getUser);
router.delete('/:id', userController.deleteUser);
router.put('/:id', userController.updateUser)

export default router 