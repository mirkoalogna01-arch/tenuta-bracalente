# Tenuta Bracalente — Sito Web

Sito vetrina per una trattoria di lusso italiana. File statici, nessuna build, pronto per Netlify.

## File del progetto
- `index.html` — struttura della pagina, SEO (meta tag, Open Graph, dati strutturati per Google)
- `style.css` — tutti gli stili
- `script.js` — animazioni scroll, menu interattivo, recensioni, form di prenotazione, lazy-loading immagini
- `netlify.toml` — configurazione di base per Netlify
- `robots.txt` — istruzioni per i motori di ricerca
- `sitemap.xml` — mappa del sito per Google

## Cosa è stato aggiunto nella revisione "premium"
- **SEO**: anteprima link su WhatsApp/Instagram (Open Graph), dati strutturati Restaurant per Google (può mostrare stelline e orari direttamente nei risultati di ricerca), favicon, robots.txt, sitemap.xml
- **Prova sociale nell'hero**: badge con valutazione e numero recensioni, visibile nei primi secondi
- **Barra di prenotazione fissa su mobile**: bottone "Prenota un tavolo" sempre visibile mentre si scorre, con tasto rapido per chiamare
- **Velocità**: le foto sotto la prima schermata si caricano solo quando l'utente ci arriva scorrendo (lazy loading), niente più font inutilizzati caricati

## Cosa è stato aggiunto nell'ultima revisione (conversione + storytelling)
- **Sezione Prenota riscritta**: titolo emozionale, testo che comunica scarsità reale (tavoli limitati), lista di rassicurazioni (risposta in 2 ore, nessun acconto), numero di telefono diretto come alternativa, pulsante con freccia animata e stato "Invio in corso..." durante l'invio
- **Nuova sezione "L'Esperienza"**: racconta in 4 momenti (l'arrivo, il territorio, la cucina viva, gli eventi speciali) l'atmosfera del locale, con immagini grandi alternate e un leggero movimento parallasse mentre si scorre
- **Dettagli anti-"generato"**: la prima card della cantina ha un piccolo badge "La casa" per distinguersi dalle altre due, invece di essere identica meccanicamente

## ⚠️ Prima di mostrare il sito a un cliente vero, aggiorna questi dati
Il numero di telefono, l'indirizzo e il rating (4.9 su 127 recensioni) nel codice sono **di esempio**. Cercali e sostituiscili con i dati reali in questi punti:
- `index.html`: cerca `+390751234567` (telefono, compare 3 volte) e sostituiscilo ovunque
- `index.html`: cerca `"ratingValue"` e `"reviewCount"` nel blocco JSON-LD, e il blocco `.hero-proof` più in basso — aggiorna con dati reali
- `index.html`: cerca `tenutabracalente.netlify.app` e sostituiscilo con l'URL reale del sito quando lo conosci

## Pubblicare su Netlify (stesso flusso che usi per Al City)
1. Crea un nuovo repository su GitHub e carica questi file (anche solo via interfaccia web di GitHub, drag & drop) — attenzione a caricare i FILE, non la cartella che li contiene, altrimenti GitHub crea una sottocartella e Netlify non trova `index.html`.
2. Vai su [netlify.com](https://app.netlify.com), "Add new site" → "Import an existing project" → collega il repository.
3. Build command: lascia vuoto. Publish directory: lascia vuoto o `.`.
4. Deploy. Il sito sarà online in 1-2 minuti.

## Form di prenotazione — già funzionante
Il form usa **Netlify Forms**: appena il sito è online, le richieste di prenotazione arrivano automaticamente nella dashboard Netlify, sezione "Forms" → "prenotazioni". Nessun backend da scrivere.

## Cosa sostituire prima di andare live
Le immagini attuali sono placeholder fotografici stabili (servizio Lorem Picsum) — servono solo a mostrare gli spazi e le proporzioni. **Vanno sostituite con foto vere del locale, dei piatti e della cantina**, esattamente come hai fatto per Al City: basta cambiare l'URL dentro `data-bg="..."` (per le immagini below-the-fold) o `background-image:url('...')` in `style.css` (per l'hero) con il percorso della tua immagine.

Punti da aggiornare con i dati reali:
- Nome, indirizzo, telefono, email, orari → sezioni `Contatti` e `Prenota` in `index.html`, e anche nel blocco dati strutturati in `<head>`
- Voci di menu e prezzi → oggetto `MENU` in cima a `script.js`
- Recensioni → array `REVIEWS` in `script.js`, e il badge nell'hero (`.hero-proof`)
- Link social (Instagram/Facebook) → sezione `Contatti` in `index.html`

## Personalizzazione colori/font
Tutti i colori e font sono variabili CSS in cima a `index.html` (dentro `:root`), così puoi cambiare l'intera palette modificando poche righe.

