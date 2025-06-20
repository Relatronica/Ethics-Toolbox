# Progetto Musica AI - Creatività, Intelligenza Artificiale e Diritto d'Autore

## 📖 Descrizione del Progetto

**Progetto Musica AI** è una web application interattiva che esplora le complesse relazioni tra creatività umana, intelligenza artificiale generativa e diritto d'autore nel contesto musicale. Il progetto combina visualizzazione di dati avanzata, interazione musicale e design moderno per offrire un'esperienza educativa e coinvolgente.

### 🎯 Obiettivi Principali

- **Visualizzazione Interattiva**: Grafo D3.js che mostra le connessioni tra concetti chiave
- **Esperienza Musicale**: Step sequencer integrato per la creazione di ritmi
- **Educazione**: Box informativo con curiosità musicali verificate
- **Design Moderno**: Interfaccia geometrica in dark mode responsive

## 🚀 Caratteristiche Principali

### 🔗 Grafo Interattivo D3.js
- **18 nodi tematici** divisi in primari e secondari
- **Connessioni dinamiche** che mostrano relazioni concettuali
- **Interazione completa** con zoom, drag e selezione nodi
- **Filtri avanzati** per tipologia di contenuto

### 🎵 Step Sequencer Musicale
- **16 step** per pattern ritmici
- **4 tracce audio** indipendenti
- **Controllo tempo** da 60 a 180 BPM
- **Tecnologia Tone.js** per audio web professionale

### 📚 Box Informativo
- **20 curiosità musicali** verificate e documentate
- **Rotazione automatica** dei contenuti
- **Temi correlati** al grafo principale
- **Fonti scientifiche** e storiche accurate

### 🎨 Design Geometrico Dark Mode
- **Palette colori moderna** con accenti geometrici
- **Layout responsive** per tutti i dispositivi
- **Animazioni fluide** e transizioni eleganti
- **CSS Grid e Flexbox** per struttura ottimale

## 🛠️ Tecnologie Utilizzate

### Frontend
- **HTML5** - Struttura semantica e accessibile
- **CSS3** - Design geometrico con CSS Grid/Flexbox
- **JavaScript ES6+** - Logica modulare e moderna

### Librerie Principali
- **D3.js v7.8.5** - Visualizzazione dati e grafo interattivo
- **Tone.js v14.7.77** - Sintesi audio e step sequencer

### Strumenti di Sviluppo
- **http-server** - Server di sviluppo locale
- **live-server** - Hot reload per sviluppo rapido

## 📁 Struttura del Progetto

```
progetto-musica-ai/
├── index.html                   # File principale HTML5
├── README.md                    # Documentazione completa
├── package.json                 # Configurazione npm
├── .gitignore                   # File Git ignore
├── css/
│   └── style.css               # Stili principali geometrici
├── js/
│   ├── main.js                 # File JavaScript principale
│   ├── graph.js                # Modulo grafo D3.js
│   ├── sequencer.js            # Modulo step sequencer
│   ├── drawer.js               # Modulo drawer laterale
│   ├── infoBox.js              # Modulo box informativo
│   ├── graphData.js            # Dati strutturati grafo
│   └── musicFacts.js           # Curiosità musicali
└── assets/
    └── sounds/                 # File audio sequencer
```

## 🚀 Installazione e Avvio

### Prerequisiti
- **Node.js** >= 14.0.0
- **npm** >= 6.0.0
- Browser moderno con supporto ES6+

### Installazione
```bash
# Clona il repository
git clone https://github.com/username/progetto-musica-ai.git

# Entra nella directory
cd progetto-musica-ai

# Installa le dipendenze
npm install
```

### Avvio del Progetto
```bash
# Server di sviluppo con live reload
npm run dev

# Server HTTP semplice
npm start

# Apertura diretta del file
# Apri index.html nel browser
```

## 🎮 Guida all'Uso

### 1. Esplorazione del Grafo
- **Click sui nodi**: Visualizza informazioni dettagliate
- **Drag & Drop**: Riposiziona i nodi liberamente
- **Zoom**: Usa la rotella del mouse per ingrandire/rimpicciolire
- **Filtri**: Attiva/disattiva nodi primari e secondari

### 2. Step Sequencer
- **Click sulle celle**: Attiva/disattiva i beat
- **Play/Stop**: Controlla la riproduzione
- **Tempo**: Regola i BPM con lo slider
- **Clear**: Resetta tutti i pattern

### 3. Box Informativo
- **Freccia**: Naviga tra le curiosità musicali
- **Lettura**: Scopri fatti interessanti sulla musica

### 4. Controlli Drawer
- **Reset Vista**: Riporta il grafo alla posizione iniziale
- **Centra Grafo**: Centra tutti i nodi
- **Forza Collegamenti**: Regola l'intensità delle connessioni

## 📊 Dati e Contenuti

### Temi del Grafo
Il grafo esplora **6 temi primari**:
1. **Creatività Umana** - Neuroplasticità e processi cognitivi
2. **AI Generativa Musicale** - Tecnologie emergenti
3. **Copyright Musicale** - Protezione legale delle opere
4. **Diritti Morali** - Diritti inalienabili degli artisti
5. **Licenze Musicali** - Gestione dei diritti
6. **Etica dell'IA** - Dibattiti contemporanei

### Curiosità Musicali
**20 fatti verificati** che includono:
- Storia della musica nello spazio
- Neuroscienze e musica
- Innovazioni tecnologiche
- Diritto d'autore e AI
- Mercato musicale contemporaneo

## 🎨 Design e UX

### Palette Colori
- **Primario**: #00d4ff (Cyan brillante)
- **Secondario**: #ff6b35 (Arancione energico)
- **Terziario**: #7b68ee (Viola tecnologico)
- **Successo**: #00ff88 (Verde vivace)
- **Warning**: #ffaa00 (Giallo attenzione)

### Responsive Design
- **Desktop**: Layout completo con drawer fisso
- **Tablet**: Adattamento controlli e dimensioni
- **Mobile**: Drawer collassabile e layout verticale

## 🔧 Personalizzazione

### Modifica dei Dati
- **graphData.js**: Aggiungi/modifica nodi e collegamenti
- **musicFacts.js**: Inserisci nuove curiosità musicali

### Stili CSS
- **Variabili CSS**: Personalizza colori in `:root`
- **Animazioni**: Modifica transizioni e effetti
- **Layout**: Adatta dimensioni e spaziature

### Funzionalità Audio
- **Tone.js**: Aggiungi nuovi suoni e strumenti
- **Pattern**: Espandi il sequencer con più tracce

## 🤝 Contributi

### Come Contribuire
1. **Fork** del repository
2. **Branch** per nuove feature (`git checkout -b feature/nuova-funzionalita`)
3. **Commit** delle modifiche (`git commit -am 'Aggiunge nuova funzionalità'`)
4. **Push** del branch (`git push origin feature/nuova-funzionalita`)
5. **Pull Request** con descrizione dettagliata

### Linee Guida
- Codice commentato in italiano
- Test delle funzionalità su più browser
- Rispetto della struttura modulare esistente
- Documentazione aggiornata per nuove feature

## 📄 Licenza

Questo progetto è rilasciato sotto licenza **MIT**. Vedi il file `LICENSE` per i dettagli completi.

## 🙏 Riconoscimenti

### Dati e Ricerca
- Ricerca scientifica su neuroplasticità musicale
- Legislazione italiana ed europea sul copyright
- Statistiche di mercato AI musicale verificate
- Curiosità storiche e scientifiche documentate

### Tecnologie
- **D3.js** - Mike Bostock e community
- **Tone.js** - Yotam Mann e contributors
- **Web Audio API** - W3C Standard

### Ispirazione
- Progetti di data visualization musicale
- Ricerca accademica su AI e creatività
- Community open source italiana

## 📞 Contatti

- **Progetto**: Musica AI - Creatività e Diritto d'Autore
- **Repository**: [GitHub](https://github.com/username/progetto-musica-ai)
- **Issues**: [Bug Reports](https://github.com/username/progetto-musica-ai/issues)

---

**Sviluppato con ❤️ per esplorare il futuro della musica nell'era dell'intelligenza artificiale**