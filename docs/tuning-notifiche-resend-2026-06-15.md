# Tuning notifiche email - 15 giugno 2026

## Obiettivo
Attivare notifiche interne quando:
- una persona apre una nuova discussione;
- una persona pubblica una risposta.

## Stato codice
Il codice chiama `sendInternalNotification` sia nella pubblicazione delle domande sia nella pubblicazione delle risposte.

Sono stati aggiunti:
- diagnostica protetta: `/api/admin/notification-testsecret=...`;
- check nel backend per vedere se le notifiche sono realmente pronte;
- fallback mittente coerente: `OrganizzaEvento <notifiche@organizzaevento.com>`;
- messaggi di errore chiari quando manca la configurazione email.

## Configurazione necessaria
Per inviare davvero email a `supportoforumevento@gmail.com` serve una variabile ambiente su Netlify:

```env
RESEND_API_KEY=la_chiave_resend
```

Variabili gi? previste:

```env
SUPPORT_EMAIL=supportoforumevento@gmail.com
RESEND_FROM_EMAIL=OrganizzaEvento <notifiche@organizzaevento.com>
```

## Risultato del test locale
Il test locale conferma che il codice e pronto, ma l'invio viene saltato perch? manca `RESEND_API_KEY`.

Risultato atteso finch? la chiave non viene inserita:

```json
{
  "ok": false,
  "reason": "Manca NOTIFICATION_WEBHOOK_URL o RESEND_API_KEY."
}
```

## Dopo inserimento chiave
Dopo aver aggiunto `RESEND_API_KEY` su Netlify bisogna:
- fare un nuovo deploy;
- aprire il backend;
- lanciare il test notifiche;
- verificare l'arrivo della mail su `supportoforumevento@gmail.com`.
