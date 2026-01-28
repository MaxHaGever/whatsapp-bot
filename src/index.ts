import "dotenv/config";
import { connectDb } from "./db/connectDb";
import app from "./app";

const PORT = Number(process.env.PORT || 3000);

async function main() {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
