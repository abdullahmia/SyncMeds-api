import { authRouter } from "@/modules/auth/auth.route";
import { productRouter } from "@/modules/product/product.routes";
import { userRouter } from "@/modules/user";
import { Router } from "express";

const router: Router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/products", productRouter);

export default router;
