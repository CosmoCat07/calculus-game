import {setClientInputRecord, startListening} from "./clientInputRecord.js"
import {SerializedInputRecord, SerializedState} from "../game/SerializedObjects.js";
import {deserializeState} from "./deserialize.js";
import {inputRecords} from "./inputRecords.js";
import {stateHistory} from "./stateHistory.js";
import {currentState, setCurrentState} from "./currentState.js";
import loop from "./loop.js";
import InputRecord from "../game/InputRecord.js";

let ws: WebSocket

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
    input: number,
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
        if (eventData.type === "init") {
            const data = eventData.data as InitData
            const id = data.id

            for(let inputRecord of data.inputRecords){
                inputRecords.set(inputRecord.id, inputRecord)
            }
            setClientInputRecord(inputRecords.get(id) as InputRecord)

            const state = deserializeState(data.state)
            stateHistory.set(state.time, state)
            setCurrentState(state)

            startListening()
            loop()
        } else if (eventData.type === "input") {
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
        } else {
        }
        // Handle other events like player creation and deletion, or other stuff
    }
}

export {ws, openSocket}