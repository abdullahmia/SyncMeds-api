import { userRouter } from "@/modules/user";
import { Router } from "express";

const router: Router = Router();

router.use("/users", userRouter);

export default router;
