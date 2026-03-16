# ✈️ FlyMinder — Smart Travel Companion

Your smart travel companion that helps you never miss a flight. FlyMinder provides intelligent departure reminders and personalized travel alerts via WhatsApp.

## Current Status

🟡 **Prototype** — Conversational layer (Copilot Studio) + WhatsApp notification (Azure Function + Twilio) working end-to-end.

---

## How It Works

1. User chats with the **FlyMinder bot** (Copilot Studio) and enters flight details
2. The bot calls the **Azure Function** (`send-reminder`) via a custom HTTP connector
3. The function sends a personalised **WhatsApp reminder** via Twilio to the specified number

---

## Project Structure

```
flyminder/
├── host.json                        # Azure Functions host config
├── local.settings.json.example      # Env var template (copy → local.settings.json)
├── functions/
│   └── send-reminder/
│       ├── index.js                 # HTTP-triggered function → Twilio WhatsApp
│       └── function.json            # Azure binding config
├── copilot-studio/
│   └── topics/
│       └── flight-entry.yaml        # FlyMinder Copilot Studio topic export
└── docs/
    └── testing-notes.md             # Twilio error codes & sandbox setup
```

---

## Local Setup

### 1. Prerequisites

- [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local) v4+
- Node.js 18+
- A Twilio account with WhatsApp sandbox enabled

### 2. Configure environment

```bash
cp local.settings.json.example local.settings.json
# Fill in your TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM
```

### 3. Run locally

```bash
func start
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `TWILIO_ACCOUNT_SID` | Your Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Your Twilio Auth Token |
| `TWILIO_FROM` | Sender number, e.g. `whatsapp:+14155238886` |
| `AzureWebJobsStorage` | Azure Storage connection string |
