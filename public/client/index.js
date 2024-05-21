window.exposed = {};
import { openSocket } from "./ws.js";
openSocket();
// import Player from "../game/Player.js"
// import {setupClientInputRecord} from "./clientInputRecord.js"
// import {clientInputRecord, startListening} from "./clientInputRecord.js"
// import State from "../game/State.js"
// import Bullet from "../game/Bullet.js"
// import {setCurrentState} from "./currentState.js"
// import loop from "./loop.js"
//
// startListening()
// setupClientInputRecord(0)
// const clientPlayer = new Player(clientInputRecord, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
//
// const players = new Set<Player>
// players.add(clientPlayer)
//
// const state = new State(new Date().getTime(), players, new Set<Bullet>())
// setCurrentState(state)
//
// loop()
