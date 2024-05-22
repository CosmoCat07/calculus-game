import {setClientInputRecord, startListening} from "./clientInputRecord.js"
import {SerializedInputRecord, SerializedState} from "../serialization/SerializedObjects.js";
import {deserializeState} from "../serialization/deserialize.js";
import {inputRecords} from "./inputRecords.js";
import {stateHistory} from "./stateHistory.js";
import {currentState, setCurrentState} from "./currentState.js";
import loop from "./loop.js";
import InputRecord from "../game/InputRecord.js";
import Input from "../game/Input.js";
import InputType from "../game/InputType.js";
import {STEP_LENGTH} from "../game/constants.js";
import State from "../game/State.js";

let ws: WebSocket
let referenceTime: number

declare global {
    interface Window { ws: WebSocket }
}

interface EventData {
    type: "init" | "input" | "refresh"
    data: InitData | InputData | refreshData
}

interface InitData {
    inputRecords: Array<SerializedInputRecord>,
    state: SerializedState,
    id: number
}

interface InputData {
    id: number,
    time: number,
    inputType: InputType,
}

interface refreshData {}

function openSocket() {
    ws = new WebSocket("ws://localhost:3000/socket")

    ws.addEventListener('open', () => {
        ws.send("test")
    })

    window.ws = ws;

    ws.onmessage = (event) => { // If the message is giving the initial state and the game can now start displaying
        // Set the state to be the initial state
        let eventData = JSON.parse(event.data) as EventData
        if (eventData.type == "init") {
            const data = eventData.data as InitData

            for(let inputRecord of data.inputRecords){
                inputRecords.set(inputRecord.id, inputRecord)
            }
            setClientInputRecord(inputRecords.get(data.id) as InputRecord)

            const state = deserializeState(data.state)
            stateHistory.set(state.time, state)
            setCurrentState(state)

            referenceTime = state.time

            startListening()
            loop()
        } else if (eventData.type == "input") {
            const data = eventData.data as InputData

            const input = new Input(data.time, data.inputType); // THIS SEMICOLON IS NECESSARY!!!
            (inputRecords.get(data.id) as InputRecord).inputs.push(input)
            const roundedTime = referenceTime + Math.floor((data.time - referenceTime)/STEP_LENGTH)*STEP_LENGTH
            if (roundedTime < currentState.time) {
                setCurrentState(stateHistory.get(roundedTime) as State)
            }
        }
        // Handle other events like player creation and deletion, or other stuff
    }
}

export {ws, openSocket}