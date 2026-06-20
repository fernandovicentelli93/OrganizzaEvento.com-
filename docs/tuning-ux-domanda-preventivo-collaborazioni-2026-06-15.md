# Tuning UX domanda, preventivo e collaborazioni

Data: 2026-06-15

## Obiettivo

Rendere pi? semplice il percorso "fai una domanda", aumentare il peso della sezione "Analizza preventivo" e sostituire la foto collaborazioni con un'immagine pi? coerente con il mondo eventi.

## Modifiche applicate

- Pagina "Fai una domanda": rimossi i percorsi cliccabili iniziali e le discussioni simili dentro al form.
- Form domanda: categoria, tipo richiesta e fase evento ora vengono suggeriti in automatico e restano modificabili in un pannello secondario.
- Form domanda: email e foto sono state spostate in un pannello facoltativo per ridurre rumore visivo.
- Homepage: il pulsante "Analizza preventivo" e ora visibile nella hero.
- Sezione "Di cosa vuoi parlare": "Analizza un preventivo" e il primo blocco, con stile pi? evidente.
- Pagina "Analizza preventivo": hero pi? forte, CTA "Inizia ora" e riepilogo chiaro di cosa viene controllato.
- Collaborazioni: sostituita la foto con una sala evento elegante, pi? coerente con la piattaforma.

## Tuning desktop

- Controllare che il blocco "Analizza un preventivo" non schiacci gli altri 3 percorsi.
- Controllare che il form domanda mostri subito titolo, contenuto e dettagli utili senza troppe azioni laterali.
- Controllare che la foto collaborazioni sia leggibile e non tagli elementi importanti.

## Tuning smartphone

- Il form domanda deve restare lineare: titolo, contenuto, dettagli, identit?, captcha, pubblica.
- I pannelli "Modifica categoria" e "Opzioni facoltative" devono restare chiusi e non rubare spazio.
- Il pulsante "Analizza preventivo" nella hero deve restare facilmente cliccabile.

## Note

La pagina "Fai una domanda" resta senza registrazione obbligatoria e mantiene captcha, moderazione e campi essenziali.

## Verifiche eseguite

- TypeScript: `tsc --noEmit` completato senza errori.
- Build locale: `next build` completata con 1352 pagine generate.
- Build copia Netlify: completata senza errori.
- Live check: homepage, fai domanda, analizza preventivo e collaborazioni rispondono `200`.
- Browser check: confermati CTA preventivo, form semplificato, hero analisi preventivo e nuova immagine evento in collaborazioni.
