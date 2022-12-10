import express from "express";
import { deleteUser } from "../controllers/userController";
import { isAuth } from "../middleware/authMiddleware";


const router = express.Router();

router.delete('/:id', isAuth, deleteUser);


export default router;