import { handleWebhookPost } from "../webhooks/whatsappWebhook";

// Minimal-but-safe Express-like res mock
const resMock = {
  sendStatus(code: number) {
    console.log("[res.sendStatus]", code);
    return this;
  },
  status(code: number) {
    console.log("[res.status]", code);
    return this; // so res.status(...).json(...) works
  },
  json(body: any) {
    console.log("[res.json]", body);
    return this;
  },
  send(body: any) {
    console.log("[res.send]", body);
    return this;
  },
};

const dummyWhatsAppWebhookPayload = {
  object: "whatsapp_business_account",
  entry: [
    {
      id: "102290129340398",
      changes: [
        {
          field: "messages",
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: "972501234567",
              phone_number_id: "123456789012345",
            },
            contacts: [
              {
                profile: { name: "Max Tester" },
                wa_id: "972541112233",
              },
            ],
            messages: [
              {
                from: "972541112233",
                id: "wamid.HBgMOTcyNTQxMTEyMjMzFQIAEhgWM0VCQ0Q3RkY2Njc4ODk5QkE3AA==",
                timestamp: "1738147200",
                type: "text",
                text: { body: "Hello! I want to book an appointment for tomorrow at 10." },
              },
            ],
          },
        },
      ],
    },
  ],
} as const;

async function main() {
  console.log("=== Running webhook handler with dummy payload ===");

  const reqMock = {
    body: dummyWhatsAppWebhookPayload,
    headers: {}, // add things here if your handler reads headers
    query: {},   // add things here if your handler reads query params
  };

  await handleWebhookPost(reqMock as any, resMock as any);

  console.log("=== Done ===");
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exitCode = 1;
});
