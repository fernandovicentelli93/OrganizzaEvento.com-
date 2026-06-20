# Tuning fornitori locali SEO e grafica - 2026-06-16

## Obiettivo

Rendere la sezione fornitori locali meno simile a una semplice lista e pi? utile per utenti, crawler e motori AI.

## Modifiche applicate

- Aggiunta sezione "metodo rapido" con quattro passaggi chiari.
- Aggiunte FAQ in pagina, tradotte in inglese, spagnolo e francese.
- Aggiunti dati strutturati `CollectionPage` e `FAQPage`.
- Aumentata leggermente l'altezza immagini delle card principali.
- Resi i box pi? squadrati e ordinati, coerenti con la direzione grafica richiesta.
- Mantenuta la CTA Vibes Planner vicino alla richiesta fornitori.

## Pagine controllate

- `/fornitori-eventi`
- `/en/event-suppliers`
- `/es/proveedores-eventos`
- `/fr/prestataires-?v?nements`

## Verifica desktop

- Build Next.js completata.
- Sezione metodo presente.
- FAQ presenti.
- Dati strutturati presenti.
- Immagini presenti nelle card locali.

## Verifica mobile

- Viewport testato: 390x844.
- Overflow orizzontale: 0 su tutte le lingue.
- CTA principali visibili.
- Link locali cliccabili.
- Immagini caricate e coerenti.
- Nessun testo fuori contenitore rilevato.

## Note SEO

- La pagina ora ha una gerarchia pi? chiara: hero, metodo, ricerche locali, archivio regionale, FAQ.
- Le FAQ sono visibili in pagina e disponibili anche come JSON-LD.
- Le card mantengono link interni verso pagine locali indicizzabili.
