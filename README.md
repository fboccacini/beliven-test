# beliven-test

## Fullstack Senior

### Specifica
L’idea in sé è piuttosto semplice: sviluppare un’applicazione compresa di un’API e di un
frontend che permetta di gestire dei quiz a più giocatori, in real time.
Attraverso un apposito pannello di amministrazione, il conduttore del quiz avrà modo di
proporre una domanda a tutti i giocatori partecipanti alla sessione di gioco. Ad ogni
sessione, il conduttore proporrà una singola domanda. Il sistema dovrà notificare a tutti i
giocatori, in real time, la disponibilità di una nuova domanda e dovrà far partire un timeout di
30s.
Il primo giocatore che prenota la risposta, interrompe il timer e ha la possibilità di fornire una
risposta. Eventuali concorrenze dovranno essere gestite automaticamente dal sistema.
Agli altri giocatori dovrà essere mostrato un feedback visivo per indicare il giocatore che ha
prenotato la risposta e che ha attualmente il diritto a rispondere.
Se la risposta del giocatore è verificata dal conduttore, la sessione verrà conclusa con un
vincitore che riceverà 1 punto in più.
Se la risposta viene considerata errata, il giocatore in questione verrà eliminato e uno dei
giocatori rimasti potrà nuovamente prenotarsi entro un timer di 10s.
Se nessun giocatore prenota la risposta prima dello scadere di uno dei timer citati, la
sessione verrà conclusa senza un vincitore e il conduttore potrà proporre una nuova
domanda.
Il quiz termina quando uno dei giocatori raggiunge la quota di 5 punti (= 5 risposte corrette).
Dal punto di vista delle scelte tecniche, hai piena libertà. Gli unici vincoli sono costituiti da:
- L’API deve essere scritta in Node.js o PHP/Laravel o .NET Core.
- Il frontend può essere scritto in uno tra React o Vue o Angular.
- Le connessioni e l’aggiornamento del gioco devono avvenire in real time.

### Richieste
- Fornire accesso ad un repository git per la visione del codice
- Pubblicare l’applicazione funzionante online da qualche parte così da poter essere provata (es. surge.sh, netlify, heroku, vercel, ecc.)
- Nel README scrivere eventuali note necessarie per l’avvio del sistema

## Requisiti per l'avvio dell'ambiente in locale
- Docker

## Istruzioni per l'avvio dell'ambiente in locale
Dalla cartella principale lanciare ```docker compose up```.
Da un browser accedere a ```localhost:3000```.