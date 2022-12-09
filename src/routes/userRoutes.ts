import express from "express";
import { deleteUser } from "../controllers/userController";
import { isAuthMiddleware } from "../middleware/authMiddleware";


const router = express.Router();

router.delete('/:id', isAuthMiddleware, deleteUser);


export default router;