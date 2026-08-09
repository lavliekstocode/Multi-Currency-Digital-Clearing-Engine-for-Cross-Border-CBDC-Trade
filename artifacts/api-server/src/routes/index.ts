import { Router, type IRouter } from "express";
import healthRouter from "./health";
import nodesRouter from "./nodes";
import corridorsRouter from "./corridors";
import transactionsRouter from "./transactions";
import fxRouter from "./fx";
import liquidityRouter from "./liquidity";
import stressRouter from "./stress";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/nodes", nodesRouter);
router.use("/corridors", corridorsRouter);
router.use("/transactions", transactionsRouter);
router.use("/route", transactionsRouter);
router.use("/fx", fxRouter);
router.use("/liquidity", liquidityRouter);
router.use("/stress", stressRouter);
router.use("/dashboard", dashboardRouter);

export default router;
