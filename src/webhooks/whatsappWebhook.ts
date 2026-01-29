import { Request, Response } from "express";
import { sendMessageViaWhatsApp } from "../services/whatsappSend";

export async function verifyWebhookGet ( req: Request, res: Response ) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      return res.status(200).send(String(challenge));
    }
  }
  res.status(403).send("Forbidden");
}

/**
 * WhatsApp Cloud API webhook POST (relevant parts)
 *
 * body.entry[0].id                              -> WABA_ID (business account)
 * body.entry[0].changes[0].value.metadata.phone_number_id -> BUSINESS_PHONE_NUMBER_ID (your number)
 *
 * Incoming user message (if present):
 * body.entry[0].changes[0].value.messages[0].from -> USER_WA_ID (reply "to" this)
 * body.entry[0].changes[0].value.messages[0].text.body -> message text (for type "text")
 *
 * Delivery/read updates for messages you sent (if present):
 * body.entry[0].changes[0].value.statuses[0].id     -> OUTGOING_MESSAGE_ID
 * body.entry[0].changes[0].value.statuses[0].status -> sent|delivered|read|failed
 */

export async function handleWebhookPost(req: Request, res: Response) {
  // acknowledge immediately
  res.sendStatus(200);

  const body = req.body;
  const phoneId = process.env.WHATSAPP_TEST_PHONE_NUMBER_ID;
  const replyTo = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;
  const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body;

  console.log("Received WhatsApp message:", { phoneId, replyTo, message });

  const testMessage = `Hello from the webhook ${message}!`;

  if (!phoneId || !replyTo || !message) return;
  await sendMessageViaWhatsApp(phoneId, replyTo, testMessage, false);
}
