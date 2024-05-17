import Player from "../game/Player.js";
import { clientInputRecord, startListening } from "./clientInputRecord.js";
import State from "../game/State.js";
import { setCurrentState } from "./currentState.js";
import gameLoop from "./gameLoop.js";
import { ws } from "./ws.js";
ws.addEventListener("open", () => {
    startListening();
    const clientPlayer = new Player(0, 0, 0, 0, clientInputRecord);
    const players = new Set;
    players.add(clientPlayer);
    const state = new State(new Date().getTime(), players, new Set());
    setCurrentState(state);
    gameLoop();
});
