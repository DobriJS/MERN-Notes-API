import express from "express";
import * as authController from "../controllers/auth.controller";

const router = express.Router();

router.get("/", authController.getCurrentUser);
router.post("/signup", authController.signUp);
router.post('/login', authController.logIn);

export default router;