import { setClientInputRecord, startListening } from "./clientInputRecord.js";
import { deserializeState } from "./deserialize.js";
import { inputRecords } from "./inputRecords.js";
import { stateHistory } from "./stateHistory.js";
import { setCurrentState } from "./currentState.js";
import loop from "./loop.js";
let ws;
function openSocket() {
    ws = new WebSocket("ws://localhost:3000/socket");
    ws.addEventListener('open', () => {
        ws.send("test");
    });
    window.ws = ws;
    ws.onmessage = (event) => {
        // Set the state to be the initial state
        let eventData = JSON.parse(event.data);
        if (eventData.type === "init") {
            const data = eventData.data;
            const id = data.id;
            for (let inputRecord of data.inputRecords) {
                inputRecords.set(inputRecord.id, inputRecord);
            }
            setClientInputRecord(inputRecords.get(id));
            const state = deserializeState(data.state);
            stateHistory.set(state.time, state);
            setCurrentState(state);
            startListening();
            loop();
        }
        else if (eventData.type === "newstate") {
            // const time = 0
            // const players = new Array<Player>()
            // const bullets = new Array<Bullet>()
            // const state = new State(time, new Set(players), new Set(bullets)) // Actually set this up right
            // setCurrentState(state)
        }
        else {
            // const time = 0
            // const roundedTime = 0
            // const player = 0
            // const inputType = inputTypes.LEFT
            //
            // const input = new Input(time, inputType); // THIS SEMICOLON IS NECESSARY!!!
            // (inputRecords.get(player) as InputRecord).actions.push(input)
            // if (roundedTime < currentState.time) {
            //     setCurrentState(stateHistory.get(roundedTime) as State) // Pray time didn't get rewinded too far
            // }
        }
        // Handle other events like player creation and deletion, or other stuff
    };
}
export { ws, openSocket };
