import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { v4 as uuid } from 'uuid';
import path from 'path';

enum Command {
  SET_NAME = 'set_name',
  TAKE_MASTERSHIP = 'take_mastership',
  STOP_TIMER = 'stop_timer',
  ANSWER = 'answer',
  OPEN_QUESTION = 'open_question',
  SEND_ANSWER = 'send_answer',
  JUDGE_ANSWER = 'judge_answer',
  RESET_GAME = 'reset_game',
  RESYNC = 'resync',
}

enum Status {
  AWAIT_MASTER = 'awaiting_master',
  AWAIT_PLAYERS = 'awaiting_players',
  AWAIT_QUESTION = 'awaiting_question',
  AWAIT_ANSWER = 'awaiting_answer',
  AWAIT_JUDGEMENT = 'awaiting_judgement',
  TIME_RUNNING = 'time_running',
  GAME_ENDED = 'game_ended',
}

const clients = {};
const max_time = 30;
const replay_time = 10;
const winning_points = 5;
let master = null;
let question = null;
let answer = null;
let answerer = null;
let timerInterval = null;
let timer = max_time;
let status = null;

// Spinning the http server and the WebSocket server.
const app = express();
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//This will create a middleware.
//When you navigate to the root page, it would use the built react-app
app.use(express.static(path.resolve(__dirname, "../frontend/build")));

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../frontend/build/index.html'))
});

const server = http.createServer(app);
const wsServer = new WebSocketServer({ server });
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});

wsServer.on('connection', (connection) => {
  // Generate a unique code for every user
  const userId = uuid();

  // Store the new connection and player data
  clients[userId] = {
    id: userId,
    connection: connection,
    points: 0,
    inGame: true,
  };
  console.log(`${userId} connected.`);

  clients[userId].connection.on('message', (message) => handleMessage(message, userId));
  clients[userId].connection.on('close', () => handleDisconnect(userId));
  broadcastStatus('Un nuovo giocatore è entrato', userId, 'Benvenuto!');
});

// Check if the master is missing or there are less than two players
const evaluateStatus = () => {
  if (master === null) {
    return Status.AWAIT_MASTER;
  } else if (getPlayers().length < 2) {
    return Status.AWAIT_PLAYERS;
  }
  return status;
}

// Get valid players
const getPlayers = () => {
  return Object.keys(clients)
    .filter((userId) => clients[userId].name?.length > 0 && userId !== master )
    .map((userId) => { 
      return clients[userId];
    });
}

// Get valid players who are not disqualified
const getActivePlayers = () => {
  return Object.keys(clients)
    .filter((userId) => clients[userId].name?.length > 0 && userId !== master && clients[userId].inGame )
    .map((userId) => { 
      return clients[userId];
    });
}

// If a player disconnects, remove it from the array and notify the others
const handleDisconnect = (userId) => {
    console.log(`${userId} disconnected.`);
    if (master === userId) {
      master = null;
    }
    delete clients[userId];
    broadcastStatus(`${clients[userId].name} ha abbandonato il gioco`, userId, `Hai abbandonato il gioco`);
};

// Main game logic. If a message comes from the frontend evaluate the command and update status
const handleMessage = (data, userId) => {
  const dataFromClient = JSON.parse(data.toString());
  let message = '';
  let alternateMessage = '';
  switch(dataFromClient.command) {
    case Command.RESYNC: 
      // A player has reconnected
      if (status == null) {
        if (dataFromClient.isMaster) {
          master = userId;
        }
        if (dataFromClient.isAnswering) {
          answer = userId
        }
        question = dataFromClient.question;
        answer = dataFromClient.answer;
        status = dataFromClient.status;
      }
      if (!dataFromClient.thisPlayer == null) {
        clients[userId].name = dataFromClient.thisPlayer.name;
        clients[userId].points = dataFromClient.thisPlayer.points;
        clients[userId].inGame = dataFromClient.thisPlayer.inGame;
      }
      console.log(`${userId} is resyncing`, dataFromClient);
      break;
    case Command.SET_NAME: 
      // A player changes its name
      message = clients[userId].name == null ? `${dataFromClient.data} è entrato in gioco` : `${clients[userId].name} è diventato ${dataFromClient.data}`;
      alternateMessage = `Hai cambiato il nome in ${dataFromClient.data}`;
      clients[userId].name = dataFromClient.data;
      console.log(`${userId} changed name to ${clients[userId].name}.`);
      break;
    case Command.TAKE_MASTERSHIP:
      // A player becomes the master
      if (master == null) {
        master = userId;
        message = clients[userId].name == null ? `${userId} è diventato il master.` : `${clients[userId].name} è diventato master`;
        if (clients[userId].name == null) {
          clients[userId].name = 'Master';
        }
        alternateMessage = `Sei diventato il master`;
        status = Status.AWAIT_QUESTION;
        console.log(`${userId} has become the master.`);
      }
      break;
    case Command.OPEN_QUESTION:
      // The master asks a question
      question = dataFromClient.data;
      message = question;
      answer = null;
      answerer = null;
      alternateMessage = 'Il timer è partito';
      timer = 30;
      timerInterval = setInterval(handleTimer, 1000);
      status = Status.TIME_RUNNING;
      console.log(`Timer has started. Master asked: ${question}`);
      break;
    case Command.STOP_TIMER:
      // A player stops the timer in order to answer
      if (status === Status.TIME_RUNNING) {
        status = Status.AWAIT_ANSWER;
        clearInterval(timerInterval);
        answerer = userId;
        message = `${clients[userId].name} ha prenotato la risposta`;
        alternateMessage = 'Hai prenotato la risposta!';
        console.log(`Timer has stopped. ${clients[answerer].name} tries to answer`);  
      }
      break;
    case Command.SEND_ANSWER:
      // The player that stopped to timer sends the answer
      answer = dataFromClient.data;
      message = `${clients[answerer].name} ha riposto ${answer}`;
      alternateMessage = 'Attendi la conferma del master';
      status = Status.AWAIT_JUDGEMENT;
      console.log(`${clients[answerer].name} answered "${answer}"`);
      break;
    case Command.JUDGE_ANSWER:
      // The master evaluates the answer
      if (dataFromClient.data) {
        // The answer is correct
        clients[answerer].points++;
        if (clients[answerer].points >= winning_points) {
          message = `Risposta corretta! ${clients[answerer].name} vince la sessione`;
          alternateMessage = `Risposta corretta! Hai vinto la sessione`;
          status = Status.GAME_ENDED;
          console.log(`${clients[answerer].name} has won the session`);
        } else {
          message = `Risposta corretta! Hai guadagnato un punto`;
          alternateMessage = `Risposta corretta! ${clients[answerer].name} guadagna un punto`;
          status = Status.AWAIT_QUESTION;
          console.log(`${clients[answerer].name} has gained one point`);
        }
      } else {
        // The answer is wrong
        clients[answerer].inGame = false;
        message = `Risposta errata! ${clients[answerer].name} è stato eliminato`;
        alternateMessage = `Risposta errata! Sei stato eliminato`;
        if (getActivePlayers().length > 0) {
          timer = replay_time;
          timerInterval = setInterval(handleTimer, 1000);
          status = Status.TIME_RUNNING;
        } else {
          Status.GAME_ENDED;
        }
        userId = answerer;
        console.log(`${clients[answerer].name} has been disqualified`);
      }
      break;
    case Command.RESET_GAME:
      // A new game starts
      answer = null;
      message = `Nuova sessione`;
      alternateMessage = 'Nuova sessione';
      master = null;
      answerer = null;
      question = null;
      for (const player in clients) {
        clients[player].points = 0;
        clients[player].inGame = true;
      }
      status = Status.AWAIT_MASTER;
      console.log(`${clients[userId].name} answered "${answer}"`);
      break;
    default: console.log(`${dataFromClient.command}: command not recognized.`);
      return;
  }
  broadcastStatus(message, userId, alternateMessage);
}

// Manage timer
const handleTimer = () => {
  timer--;
  if (timer < 0) {
    clearInterval(timerInterval);
    question = null;
    status = Status.AWAIT_QUESTION;
    return broadcastStatus('Tempo esaurito!', null, 'Tempo esaurito!');
  } 
  console.log(`Time: ${timer}`);
  return broadcastStatus(question, master, 'Il timer è partito');
}

// Notify all participants. Messages are different for the player that originated the request and the others
const broadcastStatus = (message, triggerUserId, alternateMessage) => {
  // Update game status for all players and master
  for(const userId in clients) {
    let client = clients[userId].connection;
    if(client.readyState === WebSocket.OPEN) {
      const data = {
        id: userId,
        question: question,
        answer: answer == null ? null : `${clients[answerer]?.name} ha risposto ${answer}`,
        isMaster: master === userId, 
        isAnswering: userId === triggerUserId && status === Status.AWAIT_ANSWER,
        master: clients[master]?.name,
        message: userId === triggerUserId ? alternateMessage : message,
        thisPlayer: clients[userId].name?.length ? {
          id: userId,
          name: clients[userId].name,
          points: clients[userId].points,
          inGame: clients[userId].inGame,
        } : null,
        otherPlayers: getPlayers()
          .filter((client) => {
            return client.id !== userId;
          })
          .map((client) => {
            return { id: client.id, name: client.name, points: client.points, inGame: client.inGame };
          }),
        status: evaluateStatus(),
        timer: timer,
      };
      client.send(JSON.stringify(data));
    }
  };
}
