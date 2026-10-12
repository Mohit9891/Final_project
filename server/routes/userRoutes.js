import express from 'express'
import { getUserById, getUserResumes, getUserSkills, loginUser, registerUser } from '../controllers/UserController.js';

import protect from '../middlewares/authMiddleware.js';



const userRoutes = express.Router();

userRoutes.post('/register',registerUser);
userRoutes.post('/login',loginUser);
userRoutes.get('/data',protect,getUserById);
userRoutes.get('/resumes',protect,getUserResumes);
userRoutes.get('/skills',protect,getUserSkills);



export  default userRoutes