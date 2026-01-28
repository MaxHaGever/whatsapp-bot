import Business from "../models/Business";
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

  const wabaId = req.body?.entry?.[0]?.id;
  const phoneNumberId = req.body?.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id;
  const displayPhone = req.body?.entry?.[0]?.changes?.[0]?.value?.metadata?.display_phone_number;

  console.log("WABA:", wabaId);
  console.log("phone_number_id:", phoneNumberId);
  console.log("display_phone_number:", displayPhone);

  const phoneId = phoneNumberId;

  const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body;
  if (!message) return;

  try {
    await sendMessageViaWhatsApp(phoneId, wabaId, message);
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
  }
}
