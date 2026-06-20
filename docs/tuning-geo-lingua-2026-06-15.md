# Tuning geo lingua - 2026-06-15

## Obiettivo
Rendere la homepage multilingua in base alla provenienza geografica senza rovinare UX, SEO o indicizzazione.

## Regole applicate
- Italia, San Marino e Vaticano restano sulla root italiana `/`.
- Francia, Monaco, Belgio, Lussemburgo, Svizzera e Quebec vanno su `/fr/`.
- Spagna e principali paesi ispanofoni vanno su `/es/`.
- Tutti gli altri paesi vanno su `/en/`.
- Il redirect avviene solo sulla homepage `/`.
- URL interni, sitemap, robots, API, guide, magazine e pagine gi? tradotte non vengono spostati.
- I crawler vengono esclusi dal redirect per evitare segnali SEO ambigui.
- La scelta manuale della lingua viene salvata nel cookie `oe_locale` per un anno.

## Verifiche
- TypeScript: ok.
- Build Next.js: ok.
- La logica e implementata come Netlify Edge Function su `/*`, ma interviene solo sulla homepage `/`.
