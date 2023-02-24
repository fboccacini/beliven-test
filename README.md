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

# Implementazione

Il sistema è stato implementato usando Node.js per il backend e React per il frontend. Le due app comunicano attraverso WebSocket, per mantenere lo stato in tempo reale fra tutti i giocatori.

## Istruzioni per giocare
Per partire sono necessari almeno due giocatori ed un Master, quindi tre persone. Per entrare in gioco è necessario inserire un nome, e uno dei giocatori deve diventare il master.

Una volta iniziata la partita, il master inserisce una domanda, che viene visualizzata sullo schermo di tutti i giocatori.

Nel momento in cui viene posta la domanda, ai giocatori compari un bottone timer che conta 30 secondi alla rovescia (al master compare di un altro colore e non è cliccabile).

Il primo giocatore che clicca il bottone si prenota la risposta e gli comparirà un campo di testo per inserirla. Gli altri giocatori vedranno un messaggio indicante il nome di chi ha prenotato.

Una volta inserita la risposta, tutti i giocatori vedono la risposta data ed al master vengono presentati due pulsanti: "Risposta corretta!" e "Risposta errata!".

Se il master giudica la risposta corretta cliccando sul pulsante corrispondente, il giocatore riceve un punto e si riparte con una nuova domanda. Se la giudica errata, il giocatore che ha risposto sarà eliminato e gli altri rivedranno il bottone timer (stavolta di 10 secondi) per prenotarsi.

Se nessuno prenota la risposta entro il tempo dato, viene posta un'altra domanda.
Se un giocatore raggiunge 5 punti o non rimangono giocatori in gioco, compare un pulsante "Nuova partita" con cui ricominciare da capo mantenendo i nomi, ma con la necessità di scegliere un master.

## Bootstrap da locale
In locale è possibile lanciare il sistema sia con Docker se disponibile, che manualmente.

### Requisiti per l'avvio dell'ambiente con Docker
- docker compose

### Istruzioni per l'avvio dell'ambiente con Docker
1. Dalla cartella principale lanciare ```docker compose up```.
2. Da un browser accedere a ```localhost```.

### Requisiti per l'avvio dell'ambiente manualmente
- npm

### Istruzioni per l'avvio dell-ambiente manualmente
1. Aprire una shell sulla root del progetto
2. Lanciare ```npm start```
3. Aprire un'altra shell sulla root del progetto
4. Entrare nella cartella frontend ```cd frontend```
5. Lanciare ```npm start```
6. Da un browser accedere a ```localhost:3000```.
