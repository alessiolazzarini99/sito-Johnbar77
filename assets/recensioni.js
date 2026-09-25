/*
 * RECENSIONI — dati del carosello "Cosa dicono di noi" (landing, index.html).
 *
 * Ogni recensione è un oggetto { nome, stelle, testo }:
 *   nome   → come compare sulla card (es. "Mario R.")
 *   stelle → numero intero da 1 a 5
 *   testo  → il testo originale, senza correzioni; per andare a capo usa \n
 *
 * Aggiungere una recensione: copia un blocco { ... }, incollalo dove vuoi che
 *   compaia (l'ordine dell'array è l'ordine nel carosello) e ricordati la
 *   virgola tra un blocco e l'altro.
 * Togliere una recensione: cancella il suo blocco { ... } e la virgola che lo segue.
 *
 * Il carosello, i puntini e il "Leggi tutto" si adattano da soli al numero di voci.
 * Le recensioni restano nella lingua originale anche cambiando lingua al sito.
 */
const RECENSIONI = [
  {
    nome: "Daniele D.",
    stelle: 5,
    testo: "Qualità e servizio impeccabile, unico a chilometri di distanza dagli altri.\nIntrigante l'offerta di vini al bicchiere, cocktails assolutamente perfetti e selezione accurata delle materie prime.\nGrande cordialità e professionalità, consigliato 1000 volte!!!"
  },
  {
    nome: "Valentina L.",
    stelle: 5,
    testo: "Sono passata per chiedere una bottiglia di annata '96 e mi hanno accontentata. Bottiglia introvabile, vastissima scelta di vini di alta qualità. Ragazzi simpaticissimi, molto gentili e disponibili. Locale molto accogliente, perfetto per un aperitivo rilassante. Tornerò sicuramente prestissimo."
  },
  {
    nome: "Stella B.",
    stelle: 5,
    testo: "Un'ottima scoperta!\nBar davvero consigliato! L'ambiente è molto piacevole, la gente è tranquilla e c'è sempre un'ottima atmosfera. Un plauso speciale al personale, in particolare a Nicolas: giovane, super disponibile e sempre col sorriso. Ci tornerò sicuramente!"
  },
  {
    nome: "Gianma B.",
    stelle: 5,
    testo: "Esperienza fantastica, atmosfera accogliente e poltroncine davvero confortevoli, bellissima scoperta!!\nI ragazzi sono stati davvero gentili ed i cocktail di qualità.\nCi tornerò presto, consigliatissimo! ⭐️⭐️⭐️⭐️⭐️"
  },
  {
    nome: "Francesca M.",
    stelle: 5,
    testo: "Personale gentilissimo, ottimi cocktail analcolico, ambiente sereno."
  },
  {
    nome: "Emanuela F.",
    stelle: 4,
    testo: "Bel locale con arredamento curato personale cortese. Ampia scelta di whisky,birre e altro."
  }
];
