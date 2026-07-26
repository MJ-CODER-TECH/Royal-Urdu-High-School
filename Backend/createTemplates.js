/*
|--------------------------------------------------------------------------
| Create WhatsApp Message Templates via Graph API
|--------------------------------------------------------------------------
| Ye script Meta Business Manager UI mein manually template banane ki
| jagah, seedhe API call se 3 templates create kar deta hai:
|   1. admission_confirmation
|   2. student_absent_alert
|   3. certificate_generated
|
| USAGE:
|   1. .env mein WHATSAPP_ACCESS_TOKEN aur WHATSAPP_WABA_ID set karo
|      (WABA_ID = WhatsApp Business Account ID, jo aapke screenshot mein
|       "1987646195209966" dikha tha — Phone Number ID se ALAG hai)
|   2. Terminal mein run karo: node createTemplates.js
|   3. Templates "PENDING" status mein create ho jayenge, approval ka
|      wait karna padega (WhatsApp Manager > Message Templates mein
|      status dekh sakte ho)
|--------------------------------------------------------------------------
*/

require("dotenv").config();
const axios = require("axios");

const API_VERSION = process.env.WHATSAPP_API_VERSION || "v25.0";
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WABA_ID = process.env.WHATSAPP_WABA_ID; // e.g. 1987646195209966

if (!ACCESS_TOKEN || !WABA_ID) {
    console.error(
        "ERROR: .env mein WHATSAPP_ACCESS_TOKEN aur WHATSAPP_WABA_ID set karo.\n" +
        "WABA_ID = WhatsApp Business Account ID (Phone Number ID se ALAG hai)."
    );
    process.exit(1);
}

const BASE_URL = `https://graph.facebook.com/${API_VERSION}/${WABA_ID}/message_templates`;

const templates = [

    {
        name: "admission_confirmation",
        language: "en_US",
        category: "UTILITY",
        components: [
            {
                type: "BODY",
                text:
                    "Dear Parent,\n\n" +
                    "Your child {{1}} has been successfully admitted to {{2}}.\n\n" +
                    "Admission No : {{3}}\n" +
                    "Class : {{4}}\n" +
                    "Section : {{5}}\n\n" +
                    "Thank you for choosing us. For any queries, please contact the school office.",
                example: {
                    body_text: [
                        [
                            "Ahmed Shaikh",
                            "Royal Urdu High School",
                            "ADM02",
                            "English",
                            "Nursery"
                        ]
                    ]
                }
            }
        ]
    },

    {
        name: "student_absent_alert",
        language: "en_US",
        category: "UTILITY",
        components: [
            {
                type: "BODY",
                text:
                    "Dear Parent,\n\n" +
                    "Your child {{1}} (Class {{2}} - {{3}}) was marked ABSENT on {{4}}.\n\n" +
                    "If this is incorrect, kindly contact the school office immediately.",
                example: {
                    body_text: [
                        [
                            "Ahmed Shaikh",
                            "English",
                            "Nursery",
                            "11 July 2026"
                        ]
                    ]
                }
            }
        ]
    },

    {
        name: "certificate_generated",
        language: "en_US",
        category: "UTILITY",
        components: [
            {
                type: "HEADER",
                format: "DOCUMENT",
                example: {
                    // Approval ke liye ek sample PDF ka public URL chahiye.
                    // Apna koi bhi test PDF link daal do (production data nahi hona chahiye).
                    header_handle: []
                }
            },
            {
                type: "BODY",
                text:
                    "Dear Parent,\n\n" +
                    "{{1}} has been generated successfully for {{2}}.\n\n" +
                    "Admission No : {{3}}\n\n" +
                    "Please find the attached PDF below. Thank you.",
                example: {
                    body_text: [
                        [
                            "Bonafide Certificate",
                            "Ahmed Shaikh",
                            "ADM02"
                        ]
                    ]
                }
            }
        ]
    }

];

const createTemplate = async (tpl) => {

    // HEADER document type ke liye Meta ko ek uploaded media handle chahiye
    // hota hai example ke taur pe — agar wo missing/invalid hai toh Meta
    // is component ko skip karke bina header ke bhi accept kar sakta hai,
    // ya reject karega. Agar reject ho, neeche wala fallback try karo.
    const payload = {
        name: tpl.name,
        language: tpl.language,
        category: tpl.category,
        components: tpl.components.filter(
            (c) => !(c.type === "HEADER" && c.example?.header_handle?.length === 0)
        )
    };

    try {

        const response = await axios.post(BASE_URL, payload, {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        console.log(`✅ "${tpl.name}" created — id: ${response.data.id}, status: ${response.data.status}`);

    } catch (error) {

        const errData = error.response?.data?.error;

        if (errData?.error_subcode === 2388023 || /already exists/i.test(errData?.message || "")) {

            console.log(`⚠️  "${tpl.name}" already exists — skip kar rahe hain.`);

        } else {

            console.error(`❌ "${tpl.name}" FAILED:`, JSON.stringify(errData || error.message));

        }

    }

};

(async () => {

    console.log(`Creating templates for WABA: ${WABA_ID}\n`);

    for (const tpl of templates) {
        await createTemplate(tpl);
    }

    console.log(
        "\nDone. Status check karne ke liye:\n" +
        "https://business.facebook.com/wa/manage/message-templates/\n" +
        "\"certificate_generated\" ka HEADER (PDF) hata diya gaya hai kyunki usme " +
        "media example chahiye hota hai — usko UI se manually add karna hoga " +
        "(neeche instructions dekho)."
    );

})();