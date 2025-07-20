import { productRouter } from "@/modules/product/product.routes";
import { userRouter } from "@/modules/user";
import { Router } from "express";

const router: Router = Router();

router.use("/users", userRouter);
router.use("/products", productRouter);

export default router;
