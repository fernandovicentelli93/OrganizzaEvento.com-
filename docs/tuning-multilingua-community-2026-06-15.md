# Tuning multilingua community - 2026-06-15

## Obiettivo
Rendere inglese, spagnolo e francese pi? vivi e credibili: non semplici traduzioni, ma pagine con conversazioni, articoli, guide e percorsi cliente coerenti con chi organizza eventi in Italia dall'estero.

## Cosa e stato fatto
- Create conversazioni localizzate in inglese, spagnolo e francese con nomi, nickname, budget, citt?, stato umano e risposta utile.
- Aggiunti articoli magazine localizzati e non duplicati tra lingue.
- Aggiunte guide sintetiche per clienti stranieri che organizzano eventi in Italia.
- Aggiunto ticker leggero di attivit? community.
- Homepage, pagina domande, pagina magazine, prezzi reali, fornitori locali e guide ora mostrano contenuti pi? vivi anche in EN/ES/FR.
- Rimossi i riferimenti visibili a "SEO" dal copy pubblico.
- Widget supporto localizzato in italiano, inglese, spagnolo e francese.
- Notifiche interne agganciate anche a nuove domande, nuove risposte e nuove registrazioni.

## Tuning desktop
- Header resta leggibile a 1365px.
- Hero EN con titolo corretto e CTA visibili.
- Ticker community visibile subito sotto hero.
- Sezione conversazioni appare sopra i blocchi guida, dando subito prova di community attiva.
- Copy "SEO-friendly" non presente nella pagina.

## Tuning mobile
- Test su viewport 390x844.
- Header mobile in spagnolo con CTA compatta e menu leggibile.
- Hero ES con headline su pi? righe senza sovrapposizioni.
- Ticker e prime conversazioni presenti sotto hero.
- Widget supporto compatto per non coprire troppo contenuto.
- Nessun testo italiano nel widget supporto delle pagine EN/ES/FR.

## Notifiche email
Il codice invia notifiche tramite `sendInternalNotification` per:
- richieste fornitori;
- supporto/chat;
- segnalazioni;
- iscrizioni alle risposte;
- nuove domande;
- nuove risposte;
- nuove registrazioni cliente/fornitore.

Per invio email reale serve `RESEND_API_KEY` configurata su Netlify. Il check protetto `/api/admin/form-health` ora espone `notificationHealth.resendConfigured`.

## Indicizzazione e AI
- Le pagine restano su URL distinti per lingua.
- Le pagine multilingua non mischiano contenuti visibili in lingue diverse.
- I contenuti nuovi sono pensati come casi pratici, non testo generico.
- Rimangono sitemap e hreflang gi? presenti.
