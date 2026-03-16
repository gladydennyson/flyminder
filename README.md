# FlyMinder — Smart Travel Companion

Your smart travel companion that helps you never miss a flight. FlyMinder provides intelligent departure reminders and personalized travel alerts via WhatsApp.

## Current Status

**Prototype** — Conversational layer (Copilot Studio) + WhatsApp notification (Azure Function + Twilio) working end-to-end.

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
│       └── flight-entry.yaml        # Copilot Studio adaptive dialog topic
└── docs/
    └── testing-notes.md             # Twilio sandbox setup + test cases
```

---

## Setup

### Prerequisites

- Node.js 18+
- Azure Functions Core Tools v4
- Twilio account with WhatsApp sandbox enabled
- Microsoft Copilot Studio environment

### Local Development

1. Clone the repository
2. Copy `local.settings.json.example` to `local.settings.json` and fill in your credentials
3. Run `func start` from the project root to start the Azure Function locally
4. Test the endpoint with a POST request to `http://localhost:7071/api/send-reminder`

### Environment Variables

| Variable | Description |
|---|---|
| `TWILIO_ACCOUNT_SID` | Your Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Your Twilio Auth Token |
| `TWILIO_FROM` | Twilio WhatsApp sender number (e.g. `whatsapp:+14155238886`) |
| `AzureWebJobsStorage` | Azure Storage connection string (use `UseDevelopmentStorage=true` locally) |

---

## API Reference

### POST /api/send-reminder

**Request body:**

```json
{
  "personName": "string",
  "userPhone": "string",
  "flightNumber": "string",
  "departureTime": "string",
  "originCity": "string",
  "destinationAirport": "string"
}
```

**Response:**

```json
{
  "message": "Reminder sent to <name>",
  "etaMinutes": 120,
  "twilioStatus": "queued",
  "twilioSid": "SM..."
}
```

---

## Planned Features

- Flight status lookup via aviation API
- Dynamic ETA calculation based on distance and transport mode
- Multi-language support
- Reminder scheduling (send X hours before departure)

---

## Branching Strategy

| Branch | Purpose |
|---|---|
| `main` | Stable, production-ready code |
| `feature/v1` | Active development (Azure Functions + Copilot Studio) |

---

## Tech Stack

| Component | Technology |
|---|---|
| Conversational bot | Microsoft Copilot Studio |
| Backend function | Azure Functions (Node.js 18) |
| WhatsApp messaging | Twilio API |
| Runtime | Azure Functions v4 |
