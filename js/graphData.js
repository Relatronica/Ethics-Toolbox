// Dati strutturati per il grafo D3.js - Musica, Creatività, AI e Diritto d'Autore
// Basato su ricerca approfondita sui temi del progetto

const graphData = {
  nodes: [
    // Nodi Primari - Temi Centrali
    {
      id: "creativita_umana",
      name: "Creatività Umana",
      type: "primary",
      description: "La capacità innata dell'essere umano di creare, innovare e esprimere emozioni attraverso la musica. Include neuroplasticità, connettività cerebrale e processi cognitivi creativi."
    },
    {
      id: "ai_generativa",
      name: "AI Generativa Musicale",
      type: "primary", 
      description: "Tecnologie di intelligenza artificiale che generano contenuti musicali autonomamente. Include strumenti come Udio, AIVA e modelli che creano canzoni da zero."
    },
    {
      id: "copyright_musicale",
      name: "Copyright Musicale",
      type: "primary",
      description: "Sistema legale che protegge le opere musicali per 70 anni dopo la morte dell'autore nell'UE. Tutela automatica per opere originali e creative."
    },
    {
      id: "diritti_morali",
      name: "Diritti Morali",
      type: "primary",
      description: "Diritti inalienabili e irrevocabili degli artisti: paternità dell'opera, integrità creativa e controllo sulla diffusione. Definiti dalla Legge 633/41 Art. 20."
    },
    {
      id: "licenze_musicali",
      name: "Licenze Musicali",
      type: "primary",
      description: "Sistemi di gestione dei diritti musicali attraverso enti come SIAE, ASCAP, BMI e licenze Creative Commons per uso flessibile delle opere."
    },
    {
      id: "etica_ia",
      name: "Etica dell'IA",
      type: "primary",
      description: "Dibattiti su autenticità, paternità artistica e impatto dell'AI sulla creatività umana. Include questioni su proprietà intellettuale e spostamento degli artisti."
    },

    // Nuovo nodo primario: Design Speculativo
    {
      id: "design_speculativo",
      name: "Design Speculativo",
      type: "primary",
      description: "Approccio progettuale che esplora futuri possibili e scenari ipotetici per stimolare riflessioni critiche e consapevolezza sul presente e sulle tecnologie emergenti."
    },

    // Nodi Secondari - Concetti Correlati
    {
      id: "neuroplasticita",
      name: "Neuroplasticità Musicale",
      type: "secondary",
      description: "Capacità del cervello di formare nuove connessioni neurali attraverso l'attività musicale, stimolando sinaptogenesi e connettività cerebrale."
    },
    {
      id: "emozioni_musica",
      name: "Emozioni e Musica",
      type: "secondary",
      description: "La musica come fenomeno universale capace di evocare e regolare stati emotivi, attivando meccanismi cerebrali simili agli stati alterati."
    },
    {
      id: "pensiero_divergente",
      name: "Pensiero Divergente",
      type: "secondary",
      description: "Processo cognitivo creativo stimolato dalla musica che facilita connessioni neurali innovative e immaginazione."
    },
    {
      id: "mercato_ai_musica",
      name: "Mercato AI Musicale",
      type: "secondary",
      description: "Settore in crescita con stime di 22,57 miliardi di dollari entro il 2034. Include aumento del 15% dei brani su Spotify nel 2024."
    },
    {
      id: "paternita_opera",
      name: "Paternità dell'Opera",
      type: "secondary",
      description: "Diritto fondamentale dell'artista di essere riconosciuto come creatore dell'opera musicale, parte dei diritti morali inalienabili."
    },
    {
      id: "integrita_artistica",
      name: "Integrità Artistica",
      type: "secondary",
      description: "Diritto dell'artista di opporsi a distorsioni o modifiche non autorizzate che possano danneggiare l'essenza creativa dell'opera."
    },
    {
      id: "collecting_societies",
      name: "Società di Gestione Collettiva",
      type: "secondary",
      description: "Organizzazioni come SIAE, ASCAP, BMI che gestiscono i diritti degli autori e distribuiscono royalties per l'uso pubblico delle opere."
    },
    {
      id: "creative_commons",
      name: "Creative Commons",
      type: "secondary",
      description: "Sistema alternativo di licenze che permette agli artisti di condividere opere con permessi flessibili per performance, registrazione e condivisione."
    },
    {
      id: "autenticita_musicale",
      name: "Autenticità Musicale",
      type: "secondary",
      description: "Dibattito sull'autenticità delle opere generate da AI e se la creatività sia solo riconoscimento di pattern o qualcosa di più profondo."
    },
    {
      id: "democratizzazione_musica",
      name: "Democratizzazione Musicale",
      type: "secondary",
      description: "L'AI che rende la creazione musicale accessibile a tutti, trasformando potenzialmente ogni persona in un 'musicista'."
    },
    {
      id: "proprieta_intellettuale",
      name: "Proprietà Intellettuale AI",
      type: "secondary",
      description: "Questioni legali emergenti su chi possiede le composizioni create da AI e se possano essere protette da copyright."
    },
    {
      id: "computing_quantistico",
      name: "Computing Quantistico",
      type: "secondary",
      description: "Tecnologie emergenti che combinano AI generativa e computing quantistico per nuove frontiere nella composizione musicale."
    },

    // Nodi secondari design speculativo
    {
      id: "futuri_possibili",
      name: "Futuri Possibili",
      type: "secondary",
      description: "Scenari ipotetici creati per esplorare potenziali sviluppi tecnologici, sociali ed etici."
    },
    {
      id: "riflessione_critica",
      name: "Riflessione Critica",
      type: "secondary",
      description: "Processo di analisi e valutazione dei possibili impatti delle tecnologie e delle scelte progettuali."
    },
    {
      id: "ethics_in_design",
      name: "Etica nel Design",
      type: "secondary",
      description: "Considerazioni etiche nella progettazione di sistemi e tecnologie, enfatizzate nel design speculativo."
    },
    {
      id: "coinvolgimento_pubblico",
      name: "Coinvolgimento del Pubblico",
      type: "secondary",
      description: "Stimolare la partecipazione e il dibattito pubblico attraverso scenari e prototipi speculativi."
    }
  ],

  links: [
    // Collegamenti Creatività Umana
    {
      source: "creativita_umana",
      target: "neuroplasticita",
      relationship: "stimola"
    },
    {
      source: "creativita_umana",
      target: "emozioni_musica",
      relationship: "esprime"
    },
    {
      source: "creativita_umana",
      target: "pensiero_divergente",
      relationship: "attiva"
    },
    {
      source: "creativita_umana",
      target: "ai_generativa",
      relationship: "contrasta con"
    },

    // Collegamenti AI Generativa
    {
      source: "ai_generativa",
      target: "mercato_ai_musica",
      relationship: "alimenta"
    },
    {
      source: "ai_generativa",
      target: "etica_ia",
      relationship: "solleva questioni"
    },
    {
      source: "ai_generativa",
      target: "copyright_musicale",
      relationship: "sfida"
    },
    {
      source: "ai_generativa",
      target: "democratizzazione_musica",
      relationship: "promuove"
    },
    {
      source: "ai_generativa",
      target: "computing_quantistico",
      relationship: "si evolve con"
    },

    // Collegamenti Copyright
    {
      source: "copyright_musicale",
      target: "diritti_morali",
      relationship: "include"
    },
    {
      source: "copyright_musicale",
      target: "licenze_musicali",
      relationship: "gestito tramite"
    },
    {
      source: "copyright_musicale",
      target: "proprieta_intellettuale",
      relationship: "protegge"
    },

    // Collegamenti Diritti Morali
    {
      source: "diritti_morali",
      target: "paternita_opera",
      relationship: "garantisce"
    },
    {
      source: "diritti_morali",
      target: "integrita_artistica",
      relationship: "tutela"
    },
    {
      source: "diritti_morali",
      target: "etica_ia",
      relationship: "interseca con"
    },

    // Collegamenti Licenze
    {
      source: "licenze_musicali",
      target: "collecting_societies",
      relationship: "gestite da"
    },
    {
      source: "licenze_musicali",
      target: "creative_commons",
      relationship: "include"
    },

    // Collegamenti Etica IA
    {
      source: "etica_ia",
      target: "autenticita_musicale",
      relationship: "questiona"
    },
    {
      source: "etica_ia",
      target: "paternita_opera",
      relationship: "mette in discussione"
    },

    // Collegamenti Neuroplasticità
    {
      source: "neuroplasticita",
      target: "emozioni_musica",
      relationship: "facilita"
    },
    {
      source: "neuroplasticita",
      target: "pensiero_divergente",
      relationship: "supporta"
    },

    // Collegamenti trasversali
    {
      source: "autenticita_musicale",
      target: "creativita_umana",
      relationship: "valorizza"
    },
    {
      source: "democratizzazione_musica",
      target: "licenze_musicali",
      relationship: "richiede nuove"
    },
    {
      source: "proprieta_intellettuale",
      target: "collecting_societies",
      relationship: "amministrata da"
    },

    // Collegamenti Design Speculativo
    {
      source: "design_speculativo",
      target: "futuri_possibili",
      relationship: "esplora"
    },
    {
      source: "design_speculativo",
      target: "riflessione_critica",
      relationship: "stimola"
    },
    {
      source: "design_speculativo",
      target: "ethics_in_design",
      relationship: "include"
    },
    {
      source: "design_speculativo",
      target: "coinvolgimento_pubblico",
      relationship: "favorisce"
    },

    // Collegamenti trasversali con altri temi
    {
      source: "ethics_in_design",
      target: "etica_ia",
      relationship: "interseca con"
    },
    {
      source: "riflessione_critica",
      target: "etica_ia",
      relationship: "supporta"
    }
  ]
};


// 2. Esposizione per il browser
if (typeof window !== 'undefined') {
    window.graphData = graphData;
}

// 3. Esposizione per Node.js (CommonJS)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = graphData;
}

// 4. Esposizione per moduli ES6
if (typeof exports !== 'undefined') {
    exports.default = graphData;
}