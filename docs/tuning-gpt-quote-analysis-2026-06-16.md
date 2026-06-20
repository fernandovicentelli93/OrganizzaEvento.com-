# Tuning GPT preventivi - 2026-06-16

## Obiettivo
Integrare GPT nell'area `Analizza preventivo` senza esporre la chiave API nel browser e senza rompere l'analisi locale gi? presente.

## Modifiche
- Aggiunto helper server `lib/openai-quote-analysis.ts`.
- Aggiunta API route `app/api/ai/quote-analysis/route.ts`.
- Aggiornato `components/QuoteAnalyzer.tsx` con analisi AI automatica e invisibile: nessun pulsante GPT e nessuna etichetta tecnica nella UI.
- Salvata localmente la chiave in `.env.local` come `OPENAI_API_KEY`.
- Impostati localmente:
  - `OPENAI_MODEL=gpt-5.4-mini`
  - `OPENAI_FALLBACK_MODEL=gpt-5-mini`
- Aggiunto `.env.local` a `.gitignore`.

## UX
- GPT non ? visibile come funzione separata nella UI: lavora dietro le quinte.
- Non esiste pi? il pulsante "Migliora con GPT".
- L'analisi AI parte in automatico solo dopo testo sufficiente e con debounce, usando sempre testo anonimizzato.
- Se GPT non ? configurato, non ha quota o fallisce, l'endpoint risponde comunque con analisi interna anonimizzata. La pagina non mostra errori tecnici all'utente.
- Il report GPT migliora riepilogo, domande, punti poco chiari, costi extra e messaggio al fornitore.
- Il voto e le metriche principali restano locali per mantenere stabilita e non giudicare troppo duramente preventivi indicativi, "a partire da" o trattative riservate.

## Produzione Netlify
Per avere GPT attivo anche online servono queste variabili ambiente su Netlify:
- `OPENAI_API_KEY`
- `OPENAI_MODEL=gpt-5.4-mini`
- `OPENAI_FALLBACK_MODEL=gpt-5-mini`

La chiave non va mai inserita in file pubblici o nel codice sorgente.

## Check da eseguire
- `pnpm build` -> passato.
- `pnpm test:quote-product` -> passato.
- `pnpm test:quote-scoring` -> passato.
- `GET /analizza-preventivo` su production locale `3132` -> `200`.
- `POST /api/ai/quote-analysis` live -> `200`, con `source: internal` quando OpenAI non ? configurato o non ha quota.

## Nota quota OpenAI
La chiave locale e stata creata e letta correttamente dall'app, ma OpenAI ha risposto con quota/billing esauriti durante i test locali. Il codice gestisce il caso senza 500 generico: l'endpoint usa fallback interno e la UI non mostra messaggi tecnici.

## Tuning responsive
Build e rendering server passano. Il check browser automatico completo non ? stato eseguito perch? Playwright non ? installato nel progetto e il pacchetto del runtime Codex non include `playwright-core` risolvibile da questa workspace. L'integrazione AI non aggiunge elementi visibili nella pagina, quindi non introduce nuovo ingombro su mobile/tablet/desktop.

## Aggiornamento sicurezza preventivi
- Aggiunta funzione riutilizzabile `sanitizeSensitiveData(text)` in `lib/redaction-engine.ts`.
- Placeholder standard:
  - `[EMAIL_OSCURATA]`
  - `[TELEFONO_OSCURATO]`
  - `[PIVA_OSCURATA]`
  - `[PEC_OSCURATA]`
  - `[CF_OSCURATO]`
  - `[IBAN_OSCURATO]`
  - `[INDIRIZZO_OSCURATO]`
  - `[LINK_OSCURATO]`
  - `[FORNITORE_OSCURATO]`
- L'endpoint AI risanitizza il testo ricevuto prima di chiamare OpenAI.
- L'output AI viene risanitizzato prima di tornare al browser.
- I nomi file originali non vengono pi? usati come dato interno dell'analisi.
- Test live post-deploy: nessuna stringa "GPT" visibile in `/analizza-preventivo`; endpoint `POST /api/ai/quote-analysis` torna `200` e non restituisce email, tel?fono o partita IVA del test.
