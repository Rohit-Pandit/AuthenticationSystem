import express from 'express';
import { getUserData } from '../controller/profile.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const profileRouter = express.Router();

profileRouter.get('/data', authMiddleware, getUserData);

export default profileRouter;   
