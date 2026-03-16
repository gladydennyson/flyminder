# FlyMinder — Testing Notes

## Twilio WhatsApp Sandbox Setup

Before any messages can be received, each test number must join the sandbox by sending:

```
join bent-trouble
```

to `+14155238886` on WhatsApp.

---

## Known Twilio Error Codes Encountered

| Code | Meaning | Fix |
|---|---|---|
| `21211` | Invalid To number | Ensure E.164 format with no spaces (e.g. `whatsapp:+919833613790`) |
| `21910` | Missing `whatsapp:` prefix on To number | Prefix must be `whatsapp:+<number>` — never a bare phone number |
| `11210` | Recipient not joined to sandbox | User must send `join bent-trouble` to the sandbox number first |

---

## Test Numbers Used

| Number | Region | Notes |
|---|---|---|
| `+17737445602` | US | Primary test recipient |
| `+14372337262` | CA | Secondary test recipient |
| `+919833613790` | IN | Indian number — received `11210` errors until sandbox joined |

---

## Test Flight Used

- **Flight:** Air India AI 2850
- **Route:** Bengaluru (BLR) → Mumbai (BOM)
- **Datetime:** 27 Oct 2025 20:30

---

## Lessons Learned

- The `To` field must always be prefixed with `whatsapp:` — bare numbers (`+177...`) produce error `21910`
- Spaces in the `whatsapp:` prefix (e.g. `whatsapp: 141...`) cause `21211` — ensure no whitespace
- All recipients must join the Twilio sandbox before they can receive messages in dev/test
