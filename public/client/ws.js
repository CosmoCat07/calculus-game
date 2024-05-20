import State from "../game/State.js";
import { currentState, setCurrentState } from "./currentState.js";
import { stateHistory } from "./stateHistory.js";
import Input from "../game/Input.js";
import inputTypes from "../game/inputTypes.js";
import { enemyInputRecords } from "./enemyInputRecords.js";
import gameLoop from "./gameLoop.js";
import { setupClientInputRecord } from "./clientInputRecord.js";
let ws;
function openSocket() {
    ws = new WebSocket("ws://localhost:3000/socket");
    ws.addEventListener('open', () => {
        ws.send("test");
    });
    window.ws = ws;
    ws.onmessage = () => {
        if (1 < 0) { // If the message is giving a new state
            const time = 0;
            const players = new Array();
            const bullets = new Array();
            const state = new State(time, new Set(players), new Set(bullets)); // Actually set this up right
            setCurrentState(state);
        }
        if (1 < 0) { // If the message is providing new input
            const time = 0;
            const roundedTime = 0;
            const player = 0;
            const inputType = inputTypes.LEFT;
            const input = new Input(time, inputType); // THIS SEMICOLON IS NECESSARY!!!
            enemyInputRecords.get(player).actions.push(input);
            if (roundedTime < currentState.time) {
                setCurrentState(stateHistory.get(roundedTime)); // Pray time didn't get rewinded too far
            }
        }
        if (1 < 0) { // If the message is giving the initial state and the game can now start displaying
            // Set the state to be the initial state
            const id = 0;
            setupClientInputRecord(id);
            gameLoop();
        }
        // Handle other events like player creation and deletion, or other stuff
    };
}
export { ws, openSocket };
