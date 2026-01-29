import "dotenv/config";
import { sendMessageViaWhatsApp } from "../services/whatsappSend";

async function main() {
    await sendMessageViaWhatsApp("123456789012345", "972541112233", "Hello from the test!", true);
}

main().catch((err) => {
    console.error("Script failed:", err);
    process.exitCode = 1;
});

