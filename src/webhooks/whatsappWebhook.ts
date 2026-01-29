import { Request, Response } from "express";
import { sendMessageViaWhatsApp } from "../services/whatsappSend";

export async function verifyWebhookGet(req: Request, res: Response) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(String(challenge));
  }
  return res.status(403).send("Forbidden");
}

function pickIncomingTextEvent(body: any) {
  const change = body?.entry?.[0]?.changes?.[0];
  const value = change?.value;

  const phoneNumberIdFromWebhook = value?.metadata?.phone_number_id as string | undefined;

  const msg = value?.messages?.[0];
  if (!msg) return null; // not a "messages" event (likely statuses)

  const from = msg?.from as string | undefined;
  const type = msg?.type as string | undefined;

  // Only handle text messages in this basic handler
  const textBody = msg?.text?.body as string | undefined;

  if (!from || type !== "text" || !textBody) return null;

  return {
    phoneNumberIdFromWebhook,
    from,
    textBody,
  };
}

export function handleWebhookPost(req: Request, res: Response) {

  // Acknowledge immediately to stop retries
  res.sendStatus(200);
  console.log("🚨 webhook POST HIT", {
    path: req.path,
    contentType: req.headers["content-type"],
  });
    console.log("🚨 webhook BODY keys:", Object.keys(req.body ?? {}));
  // Continue processing async without crashing the request lifecycle
  void (async () => {
    const event = pickIncomingTextEvent(req.body);

    if (!event) {
      // Optional: uncomment if you want to see non-message events
      // console.log("Webhook event ignored (not incoming text message).");
      return;
    }

    const phoneNumberId =
      process.env.WHATSAPP_TEST_PHONE_NUMBER_ID || event.phoneNumberIdFromWebhook;

    const replyTo = event.from;
    const incomingText = event.textBody;

    console.log("Received WhatsApp text:", {
      phoneNumberId,
      replyTo,
      incomingText,
      usedOverride: !!process.env.WHATSAPP_TEST_PHONE_NUMBER_ID,
    });

    if (!phoneNumberId) {
      console.error("No phone_number_id available (neither env override nor webhook metadata).");
      return;
    }

    const replyText = `Hello from the webhook: ${incomingText}`;

    await sendMessageViaWhatsApp(phoneNumberId, replyTo, replyText, false);
  })();
}
