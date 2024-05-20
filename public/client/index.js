// import {openSocket} from "./ws.js"
//
// openSocket()
//
// declare global {
//     interface Window { ws: WebSocket }
// }
import Player from "../game/Player.js";
import { setupClientInputRecord } from "./clientInputRecord.js";
import { clientInputRecord, startListening } from "./clientInputRecord.js";
import State from "../game/State.js";
import { setCurrentState } from "./currentState.js";
import loop from "./loop.js";
startListening();
setupClientInputRecord(0);
const clientPlayer = new Player(0, 0, 0, 0, clientInputRecord);
const players = new Set;
players.add(clientPlayer);
const state = new State(new Date().getTime(), players, new Set());
setCurrentState(state);
loop();
