# Tuning iPad hero - 2026-06-16

## Obiettivo
Eliminare fuoriuscite orizzontali e layout troppo compressi negli hero su iPad, senza cambiare il comportamento desktop e smartphone.

## Correzioni applicate
- Header desktop spostato da `md` a `xl`: su iPad si usa il menu compatto, evitando overflow del menu orizzontale.
- Titoli hero ridotti su tablet: `sm:text-5xl` e solo da `xl` torna `text-6xl`.
- Hero "Analizza preventivo" e pagine SEO preventivo: griglia a due colonne spostata da `lg` a `xl`, così il pannello resta sotto al testo su tablet.
- Card laterali negli hero preventivo rese `min-w-0` per evitare larghezze implicite fuori viewport.

## Viewport testati
- iPad verticale: `768 x 1024`
- iPad orizzontale: `1024 x 768`
- Desktop controllo: `1440 x 900`

## Pagine testate
- `/`
- `/analizza-preventivo`
- `/analizza-preventivo/dj/milano-mi`
- `/en`
- `/en/analyze-quote`
- `/es`
- `/fr/analyser-devis`

## Risultato overflow orizzontale
- iPad verticale: `0 px` su tutte le pagine testate.
- iPad orizzontale: `0 px` su tutte le pagine testate.
- Desktop: `0 px` su tutte le pagine testate.

## Nota UX
Su tablet il menu compatto resta intenzionale: il menu completo con tutte le voci e il selettore lingua occupa troppo spazio fra 768 e 1024 px, soprattutto nelle lingue estere.
