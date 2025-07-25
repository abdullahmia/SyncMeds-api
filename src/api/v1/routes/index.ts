import { authRouter } from "@/modules/auth/auth.route";
import { customerRouter } from "@/modules/customer";
import { inventoryRouter } from "@/modules/inventory";
import { productRouter } from "@/modules/product/product.routes";
import { saleRouter } from "@/modules/sale";
import { userRouter } from "@/modules/user";
import { Router } from "express";

const router: Router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/customers", customerRouter);
router.use("/products", productRouter);
router.use("/inventory", inventoryRouter);
router.use("/sales", saleRouter);

export default router;
