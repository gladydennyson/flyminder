// Zero-dependency Azure Function: HTTP -> Twilio WhatsApp
// Uses only Node core modules.
const https = require("https");
const qs = require("querystring");

module.exports = async function (context, req) {
  try {
    let b = req.body || {};
    if (typeof b === "string") {
      try { b = JSON.parse(b); } catch { b = {}; }
    }

    const {
      personName = b.name,
      userPhone  = b.to || b.user_phone || b.phone,
      flightNumber,
      dateTimeISO,
      originAddress,
      destinationAirport,
      body: customMessage
    } = b;

    if (!personName || !userPhone) {
      return sendJson(context, 200, { ok: false, error: "Missing required fields: personName, userPhone." });
    }

    const etaMin = 45;

    const sid   = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from  = process.env.TWILIO_FROM;

    if (!sid || !token || !from) {
      return sendJson(context, 500, { ok: false, error: "Twilio not configured (missing TWILIO_* env vars)" });
    }

    const message =
      customMessage ||
      `Hi ${personName}! ✈️
Flight: ${flightNumber || "N/A"}
ETA to airport: ~${etaMin} min
From: ${originAddress || "N/A"}
To: ${destinationAirport || "N/A"}`;

    const postData = qs.stringify({
      To: userPhone,
      From: from,
      Body: message
    });

    const authHeader = "Basic " + Buffer.from(`${sid}:${token}`).toString("base64");

    const options = {
      hostname: "api.twilio.com",
      port: 443,
      path: `/2010-04-01/Accounts/${sid}/Messages.json`,
      method: "POST",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData)
      },
      timeout: 15000
    };

    const twilioResp = await httpPost(options, postData);
    let twilioJson;
    try { twilioJson = JSON.parse(twilioResp.body); } catch { twilioJson = { raw: twilioResp.body }; }

    context.log("Twilio status:", twilioResp.status);
    if (twilioResp.status >= 400) context.log("Twilio error payload:", twilioResp.body);

    return sendJson(context, 200, {
      ok: twilioResp.status >= 200 && twilioResp.status < 300,
      etaMinutes: etaMin,
      twilioStatus: twilioResp.status,
      twilioSid: twilioJson.sid || null,
      twilioResponse: twilioJson,
      echo: { personName, userPhone, flightNumber, dateTimeISO, originAddress, destinationAirport }
    });

  } catch (e) {
    context.log.error("send-reminder error:", e);
    return sendJson(context, 500, { ok: false, error: String(e && e.message ? e.message : e) });
  }
};

function httpPost(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(new Error("Request timed out")); });
    req.write(body);
    req.end();
  });
}

function sendJson(context, status, obj) {
  context.res = {
    status,
    headers: { "Content-Type": "application/json" },
    body: obj
  };
}
