import Business from "../models/Business";
import axios from "axios";

export async function sendMessageViaWhatsApp ( phoneNumberId: string, to: string, message: string ) {
    const token = process.env.WHATSAPP_TEST_NUMBER_TEMPORARY_TOKEN;
    try {
        await axios.post(`https://graph.facebook.com/v${process.env.GRAPH_VER}/${phoneNumberId}/messages`, {
            messaging_product: "whatsapp",
            to,
            type: "text",
            text: { body: message }
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });
    } catch (error) {
        console.error("Error sending WhatsApp message:", error);
    }
}
