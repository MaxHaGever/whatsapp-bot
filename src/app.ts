import express from "express";
import whatsappRoutes from "./routes/whatsappWebhookRoute";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/whatsapp", whatsappRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use

export default app;
