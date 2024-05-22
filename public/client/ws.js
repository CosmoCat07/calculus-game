import { setClientInputRecord, startListening } from "./clientInputRecord.js";
import { deserializeState } from "../serialization/deserialize.js";
import { inputRecords } from "./inputRecords.js";
import { stateHistory } from "./stateHistory.js";
import { currentState, setCurrentState } from "./currentState.js";
import loop from "./loop.js";
import Input from "../game/Input.js";
import { STEP_LENGTH } from "../game/constants.js";
let ws;
let referenceTime;
function openSocket() {
    ws = new WebSocket("ws://localhost:3000/socket");
    window.ws = ws;
    ws.onmessage = (event) => {
        // Set the state to be the initial state
        let eventData = JSON.parse(event.data);
        if (eventData.type == "init") {
            const data = eventData.data;
            for (let inputRecord of data.inputRecords) {
                inputRecords.set(inputRecord.id, inputRecord);
            }
            setClientInputRecord(inputRecords.get(data.id));
            const state = deserializeState(data.state);
            stateHistory.set(state.time, state);
            setCurrentState(state);
            referenceTime = state.time;
            startListening();
            loop();
        }
        else if (eventData.type == "input") {
            const data = eventData.data;
            const input = new Input(data.time, data.inputType); // THIS SEMICOLON IS NECESSARY!!!
            inputRecords.get(data.id).inputs.push(input);
            const roundedTime = referenceTime + Math.floor((data.time - referenceTime) / STEP_LENGTH) * STEP_LENGTH;
            if (roundedTime < currentState.time) {
                setCurrentState(stateHistory.get(roundedTime));
            }
        }
        // Handle other events like player creation and deletion, or other stuff
    };
}
export { ws, openSocket };
