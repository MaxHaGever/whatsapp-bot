import Business from "../models/Business";
import axios from "axios";

export async function sendMessageViaWhatsApp ( businessPhoneId: string, to: string, message: string ) {
    
    let token = process.env.WHATSAPP_TEST_NUMBER_TEMPORARY_TOKEN;

  try {
    await axios.post(`https://graph.facebook.com/v${process.env.GRAPH_VER}/${businessPhoneId}/messages`, {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message }
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
  }
}

