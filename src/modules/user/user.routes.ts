import { Router } from "express";
import userController from "./user.controller";

const router: Router = Router();

router.get("/", userController.getAllUsers);

export { router as userRouter };
