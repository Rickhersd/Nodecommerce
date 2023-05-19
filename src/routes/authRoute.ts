import express  from "express";
import userController from "../controllers/userCtrl"
const router= express.Router();

router.post('/register', userController.createUser);
router.post('/login', userController.loginUserCtrl);

export default router 