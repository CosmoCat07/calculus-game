import State, {SerializedState} from "../game/State.js"
import Player from "../game/Player.js"
import Bullet from "../game/Bullet.js"
import {currentState, setCurrentState} from "./currentState.js"
import {stateHistory} from "./stateHistory.js"
import Input, {SerializedInput} from "../game/Input.js"
import InputTypes from "../game/InputTypes.js"
import {inputRecords} from "./inputRecords.js"
import InputRecord, {SerializedInputRecord} from "../game/InputRecord.js"
import loop from "./loop.js"
import {setupClientInputRecord} from "./clientInputRecord.js"

let ws: WebSocket

declare global {
    interface Window { ws: WebSocket }
}

interface EventData {
    type: "init" | "newstate" | "input"
    data: InitData | InputData | NewStateData
}

interface InitData {
    inputRecords: Array<SerializedInputRecord>,
    state: SerializedState,
    id: number
}

interface InputData {}

interface NewStateData {}

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
            let data = eventData.data as InitData
            console.log("asdoijfjaoiedbcxiujawoidjxzociuvlhaiuwlhd")
            const id = 0
            setupClientInputRecord(id)
            //loop()
        } else if (eventData.type === "newstate") {
            // const time = 0
            // const players = new Array<Player>()
            // const bullets = new Array<Bullet>()
            // const state = new State(time, new Set(players), new Set(bullets)) // Actually set this up right
            // setCurrentState(state)
        } else {
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
    }
}

export {ws, openSocket}