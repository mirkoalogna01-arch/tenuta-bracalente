# Tenuta Bracalente — Sito Web

Sito vetrina per una trattoria di lusso italiana. Tre file, nessuna build, pronto per Netlify.

## File del progetto
- `index.html` — struttura della pagina e contenuti
- `style.css` — tutti gli stili (token colore/tipografia in cima a `index.html`, dentro `<style>`)
- `script.js` — animazioni scroll, menu interattivo, recensioni, form di prenotazione
- `netlify.toml` — configurazione di base per Netlify

## Pubblicare su Netlify (stesso flusso che usi per Al City)
1. Crea un nuovo repository su GitHub e carica questi file (anche solo via interfaccia web di GitHub, drag & drop).
2. Vai su [netlify.com](https://app.netlify.com), "Add new site" → "Import an existing project" → collega il repository.
3. Build command: lascia vuoto. Publish directory: `.` (cartella radice).
4. Deploy. Il sito sarà online in 1-2 minuti su un URL `nome-a-caso.netlify.app`, che puoi rinominare dalle impostazioni del sito.

## Form di prenotazione — già funzionante
Il form usa **Netlify Forms**: appena il sito è online, le richieste di prenotazione arrivano automaticamente nella dashboard Netlify, sezione "Forms" → "prenotazioni". Nessun backend da scrivere.
Puoi anche collegare una notifica email automatica da Netlify (Site settings → Forms → Form notifications).

## Cosa sostituire prima di andare live
Le immagini attuali sono placeholder fotografici stabili (servizio Lorem Picsum, sempre raggiungibili) — servono solo a mostrare gli spazi e le proporzioni. **Vanno sostituite con foto vere del locale, dei piatti e della cantina**, esattamente come hai fatto per Al City: basta cambiare l'URL dentro `background-image:url('...')` in `style.css` con il percorso della tua immagine (anche base64 se preferisci lo stesso pattern del sito Al City).

Punti da aggiornare con i dati reali:
- Nome, indirizzo, telefono, email, orari → sezioni `Contatti` e `Prenota` in `index.html`
- Voci di menu e prezzi → oggetto `MENU` in cima a `script.js`
- Recensioni → array `REVIEWS` in `script.js`
- Link social (Instagram/Facebook) → sezione `Contatti` in `index.html`

## Personalizzazione colori/font
Tutti i colori e font sono variabili CSS in cima a `index.html` (dentro `:root`), così puoi cambiare l'intera palette modificando poche righe.
