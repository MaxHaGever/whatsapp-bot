import express from "express";
import whatsappRoutes from "./routes/whatsappWebhookRoute";

const app = express();

app.use((req, _res, next) => {
  console.log("INCOMING:", req.method, req.originalUrl, "content-type:", req.headers["content-type"]);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/whatsapp", whatsappRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

export default app;
