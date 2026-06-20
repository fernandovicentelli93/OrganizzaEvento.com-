# Tuning multilingua 2026-06-15

## Obiettivo
- Italiano invariato sulla root `/`.
- Versioni pubbliche per `/en`, `/es`, `/fr`.
- Homepage inglese orientata alla ricerca internazionale: `Plan your event in Italy with trusted local suppliers.`
- Title, H1, canonical e sitemap verificati sul dominio live.

## Controllo desktop
- Header mantiene logo, menu, CTA e selettore lingua visibile.
- `/en` mostra H1 e title in inglese.
- `/es` mostra H1 e title in spagnolo.
- `/fr` mostra H1 e title in francese.
- Canonical self-referencing:
  - `https://organizzaevento.com/en/`
  - `https://organizzaevento.com/es/`
  - `https://organizzaevento.com/fr/`

## Controllo mobile
- Le route lingua usano lo stesso header mobile gi? ottimizzato.
- Il selettore lingua resta nel menu mobile.
- La CTA principale resta accessibile senza cambiare la UX italiana.

## SEO e indicizzazione
- `/sitemap.xml` ora punta all'indice multilingua.
- Sitemap lingua live:
  - `https://organizzaevento.com/sitemap-it.xml`
  - `https://organizzaevento.com/sitemap-en.xml`
  - `https://organizzaevento.com/sitemap-es.xml`
  - `https://organizzaevento.com/sitemap-fr.xml`
- `robots.txt` include tutte le sitemap.
- Le pagine lingua hanno hreflang reciproci e x-default verso la versione italiana.

## Verifiche eseguite
- `pnpm exec tsc --noEmit`
- `pnpm run build`
- Deploy Netlify produzione completato.
- Verifica live con HTTP 200 su `/en`, `/es`, `/fr`, `/sitemap.xml`, `/sitemap-en.xml`.
