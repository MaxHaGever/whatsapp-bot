import axios from "axios";


export async function sendMessageViaWhatsApp(
  phoneNumberId: string,
  to: string,
  message: string,
  dryRun: boolean = false
) {
  const graphVer = process.env.GRAPH_VER || "24.0";
  const token = process.env.WHATSAPP_TEST_NUMBER_TEMPORARY_TOKEN;

  if (!token) {
    console.error("Missing WHATSAPP_TEST_NUMBER_TEMPORARY_TOKEN in env");
    return;
  }

  const url = `https://graph.facebook.com/v${graphVer}/${phoneNumberId}/messages`;
  const data = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: message },
  };

  if (dryRun) {
    console.log("[DRY RUN] Would send WhatsApp message:", {
      url,
      phoneNumberId,
      to,
      message,
      tokenSet: true,
    });
    return;
  }

  try {
    const resp = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 10_000,
    });

    console.log("WhatsApp send OK:", {
      status: resp.status,
      messageId: resp.data?.messages?.[0]?.id,
    });
  } catch (err: any) {
    const status = err?.response?.status;
    const meta = err?.response?.data;

    console.error("WhatsApp send FAILED:", { status });
    console.error("Meta error body:", meta);

    // Extra helpful hint for the most common case:
    const metaMsg = meta?.error?.message as string | undefined;
    if (metaMsg && metaMsg.toLowerCase().includes("24")) {
      console.error(
        "Hint: This may be the 24-hour window restriction. You might need to use a template message."
      );
    }
  }
}
