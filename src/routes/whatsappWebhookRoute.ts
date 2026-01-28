import { Router } from "express";
import { verifyWebhookGet , handleWebhookPost } from "../webhooks/whatsappWebhook";

const router = Router();

router.get("/", verifyWebhookGet);
router.post("/", handleWebhookPost);

export default router;
