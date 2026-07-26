const axios = require("axios");

/*
|--------------------------------------------------------------------------
| Config
|--------------------------------------------------------------------------
| .env se load hota hai. Server start hote hi validate karte hain taaki
| galat/missing config ki wajah se runtime pe silent fail na ho.
|--------------------------------------------------------------------------
*/

const API_VERSION = process.env.WHATSAPP_API_VERSION || "v25.0";
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

if (!ACCESS_TOKEN || !PHONE_NUMBER_ID) {
    // Server crash nahi karte, lekin loudly warn karte hain — production me
    // ye missing hona bahut common silent-failure cause hai.
    console.error(
        "[WhatsApp] WARNING: WHATSAPP_ACCESS_TOKEN ya WHATSAPP_PHONE_NUMBER_ID " +
        ".env me set nahi hai. WhatsApp messages fail honge."
    );
}

const client = axios.create({

    baseURL: `${BASE_URL}/${PHONE_NUMBER_ID}`,

    timeout: 15000,

    headers: {

        Authorization: `Bearer ${ACCESS_TOKEN}`,

        "Content-Type": "application/json"

    }

});

/*
|--------------------------------------------------------------------------
| Normalize Mobile Number
|--------------------------------------------------------------------------
| WhatsApp Cloud API ko number full international format me chahiye
| (country code ke saath, koi +, space, dash nahi).
| Example: "9146328932" -> "919146328932"
|--------------------------------------------------------------------------
*/

exports.normalizeMobile = (mobile) => {

    if (!mobile) return null;

    let digits = String(mobile).replace(/\D/g, "");

    // 10 digit Indian mobile -> country code (91) prefix karo
    if (digits.length === 10) {
        digits = "91" + digits;
    }

    // Bahut chhota/galat number reject karo
    if (digits.length < 10) return null;

    return digits;

};

/*
|--------------------------------------------------------------------------
| Common Error Handler
|--------------------------------------------------------------------------
*/

const handleError = (error, context) => {

    const errData =
        error.response?.data ||
        { error: { message: error.message, code: "NETWORK_ERROR" } };

    console.error(
        `[WhatsApp][${context}] ERROR:`,
        JSON.stringify(errData)
    );

    return { success: false, error: errData };

};

const handleSuccess = (response) => ({

    success: true,

    messageId: response.data.messages?.[0]?.id || null,

    response: response.data

});

/*
|--------------------------------------------------------------------------
| Send Template Message
|--------------------------------------------------------------------------
| PRODUCTION me ye function hi use hona chahiye jab aap first-time /
| business-initiated message bhej rahe ho (admission, absent alert, etc).
| Plain text (sendTextMessage) sirf tab kaam karta hai jab customer ne
| khud last 24 hours me aapko message kiya ho.
|
| Template pehle se Meta Business Manager me APPROVED hona chahiye.
|--------------------------------------------------------------------------
*/

exports.sendTemplateMessage = async (

    phoneNumber,

    templateName,

    languageCode = "en_US",

    bodyParams = [],

    components = null

) => {

    const to = exports.normalizeMobile(phoneNumber);

    if (!to) {
        return { success: false, error: { message: "Invalid recipient phone number" } };
    }

    // Agar caller ne custom components (header/document/buttons) nahi diye,
    // toh simple body-text params se banao
    const templateComponents =
        components ||
        (bodyParams.length > 0
            ? [
                {
                    type: "body",
                    parameters: bodyParams.map((p) => ({
                        type: "text",
                        text: String(p)
                    }))
                }
            ]
            : []);

    try {

        const response = await client.post("/messages", {

            messaging_product: "whatsapp",

            recipient_type: "individual",

            to,

            type: "template",

            template: {

                name: templateName,

                language: { code: languageCode },

                components: templateComponents

            }

        });

        return handleSuccess(response);

    } catch (error) {

        return handleError(error, "sendTemplateMessage");

    }

};

/*
|--------------------------------------------------------------------------
| Send Document Template (PDF ke sath template, jaise certificate)
|--------------------------------------------------------------------------
| Template ka HEADER type "DOCUMENT" hona chahiye Meta Business Manager me.
|--------------------------------------------------------------------------
*/

exports.sendDocumentTemplate = async (

    phoneNumber,

    templateName,

    languageCode,

    documentUrl,

    filename,

    bodyParams = []

) => {

    const to = exports.normalizeMobile(phoneNumber);

    if (!to) {
        return { success: false, error: { message: "Invalid recipient phone number" } };
    }

    const components = [

        {
            type: "header",
            parameters: [
                {
                    type: "document",
                    document: { link: documentUrl, filename }
                }
            ]
        }

    ];

    if (bodyParams.length > 0) {

        components.push({
            type: "body",
            parameters: bodyParams.map((p) => ({ type: "text", text: String(p) }))
        });

    }

    try {

        const response = await client.post("/messages", {

            messaging_product: "whatsapp",

            recipient_type: "individual",

            to,

            type: "template",

            template: {
                name: templateName,
                language: { code: languageCode },
                components
            }

        });

        return handleSuccess(response);

    } catch (error) {

        return handleError(error, "sendDocumentTemplate");

    }

};

/*
|--------------------------------------------------------------------------
| Send Text Message
|--------------------------------------------------------------------------
| SIRF us case me use karo jab 24-hour session window open ho (customer
| ne khud recently message kiya ho) — jaise reply-to-query flows me.
| Business-initiated pehla message ke liye TEMPLATE use karo.
|--------------------------------------------------------------------------
*/

exports.sendTextMessage = async (phoneNumber, message) => {

    const to = exports.normalizeMobile(phoneNumber);

    if (!to) {
        return { success: false, error: { message: "Invalid recipient phone number" } };
    }

    try {

        const response = await client.post("/messages", {

            messaging_product: "whatsapp",

            recipient_type: "individual",

            to,

            type: "text",

            text: { preview_url: false, body: message }

        });

        return handleSuccess(response);

    } catch (error) {

        return handleError(error, "sendTextMessage");

    }

};

/*
|--------------------------------------------------------------------------
| Send Document (session window ke andar, bina template ke)
|--------------------------------------------------------------------------
*/

exports.sendDocument = async (

    phoneNumber,

    documentUrl,

    filename = "Document.pdf"

) => {

    const to = exports.normalizeMobile(phoneNumber);

    if (!to) {
        return { success: false, error: { message: "Invalid recipient phone number" } };
    }

    try {

        const response = await client.post("/messages", {

            messaging_product: "whatsapp",

            recipient_type: "individual",

            to,

            type: "document",

            document: { link: documentUrl, filename }

        });

        return handleSuccess(response);

    } catch (error) {

        return handleError(error, "sendDocument");

    }

};