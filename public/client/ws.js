import { clientInputRecord, setClientInputRecord, startListening } from "./clientInputRecord.js";
import { deserializeInputRecord, deserializePlayer, deserializeState } from "../serialization/deserialize.js";
import { inputRecords } from "./inputRecords.js";
import { stateHistory } from "./stateHistory.js";
import { currentState, setCurrentState } from "./currentState.js";
import loop from "./loop.js";
import InputRecord from "../game/InputRecord.js";
import Input from "../game/Input.js";
import { STEP_LENGTH } from "../game/constants.js";
import { clientStateEvents } from "./clientStateEvents.js";
import { DisconnectEvent, JoinEvent } from "./stateEventTypes.js";
import { setCurrentTime } from "./time.js";
let ws;
let referenceTime;
function roundTime(time) {
    return referenceTime + Math.floor((time - referenceTime) / STEP_LENGTH) * STEP_LENGTH;
}
let hasBeenInit = false;
let name = prompt("Display name", "Shefler");
function openSocket() {
    let url = ((location.protocol === "http:" || location.hostname === "localhost") ? "ws:" : "wss:") + location.host + location.pathname;
    ws = new WebSocket(url + "socket");
    window.ws = ws;
    let sendTime;
    ws.onopen = () => {
        sendTime = Date.now();
        ws.send(JSON.stringify({
            type: "init",
            data: {
                name: name
            }
        }));
    };
    ws.onmessage = (event) => {
        var _a;
        // Set the state to be the initial state
        let eventData = JSON.parse(event.data);
        if (eventData.type == "init") {
            const data = eventData.data;
            let id = (_a = data.id) !== null && _a !== void 0 ? _a : clientInputRecord.id;
            let oldClientInputRecord = clientInputRecord;
            for (let inputRecord of data.inputRecords) {
                inputRecords.set(inputRecord.id, deserializeInputRecord(inputRecord));
            }
            setClientInputRecord(inputRecords.get(id));
            const state = deserializeState(data.state);
            stateHistory.set(state.time, state);
            setCurrentState(state);
            if (oldClientInputRecord) {
                clientInputRecord.inputs.push(...oldClientInputRecord.inputs.filter((input) => input.time >= state.time));
            }
            if (data.time) {
                setCurrentTime(data.time + (Date.now() - sendTime) / 2);
            }
            if (!hasBeenInit) {
                referenceTime = state.time;
                startListening();
                loop();
            }
        }
        else if (eventData.type == "input") {
            const data = eventData.data;
            if (data.id != clientInputRecord.id) {
                const input = new Input(data.time, data.inputType); // THIS SEMICOLON IS NECESSARY!!!
                inputRecords.get(data.id).inputs.push(input);
                // console.log(inputRecords.get(data.id) as InputRecord)
                // console.log("Input at " + data.time)
                const roundedTime = referenceTime + Math.floor((data.time - referenceTime) / STEP_LENGTH) * STEP_LENGTH;
                if (roundedTime < currentState.time) {
                    setCurrentState(stateHistory.get(roundedTime));
                    // console.log("Reset to " + currentState.time)
                }
            }
        }
        else if (eventData.type == "join") {
            const data = eventData.data;
            if (data.id != clientInputRecord.id) {
                const inputRecord = new InputRecord(data.id);
                inputRecords.set(data.id, inputRecord);
                const player = deserializePlayer(data.player);
                clientStateEvents.push(new JoinEvent(data.time, player));
                const roundedTime = roundTime(data.time);
                if (roundedTime < currentState.time) {
                    setCurrentState(stateHistory.get(roundedTime));
                }
            }
        }
        else if (eventData.type === "disconnect") {
            const data = eventData.data;
            clientStateEvents.push(new DisconnectEvent(data.time, data.id));
        }
        // Handle other events like player creation and deletion, or other stuff
    };
}
export { ws, openSocket };
