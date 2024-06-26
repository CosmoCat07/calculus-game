import {clientInputRecord, setClientInputRecord, startListening} from "./clientInputRecord.js"
import {SerializedInputRecord, SerializedPlayer, SerializedState} from "../serialization/SerializedObjects.js";
import {deserializeInputRecord, deserializePlayer, deserializeState} from "../serialization/deserialize.js";
import {inputRecords} from "./inputRecords.js";
import {stateHistory} from "./stateHistory.js";
import {currentState, setCurrentState} from "./currentState.js";
import loop from "./loop.js";
import InputRecord from "../game/InputRecord.js";
import Input from "../game/Input.js";
import InputType from "../game/InputType.js";
import {STEP_LENGTH} from "../game/constants.js";
import State from "../game/State.js";
import {clientStateEvents} from "./clientStateEvents.js";
import {DisconnectEvent, JoinEvent} from "./stateEventTypes.js";
import {setCurrentTime} from "./time.js";

let ws: WebSocket
let referenceTime: number

declare global {
    interface Window { ws: WebSocket }
}

interface EventData {
    type: "init" | "input" | "join" | "disconnect"
    data: InitData | InputData | JoinData
}

interface InitData {
    inputRecords: Array<SerializedInputRecord>,
    state: SerializedState,
    time?: number
    id?: number
}

interface InputData {
    id: number,
    time: number,
    inputType: InputType,
}

interface JoinData {
    id: number,
    time: number,
    player: SerializedPlayer,
}

interface DisconnectData {
    id: number,
    time: number
}

function roundTime(time: number){
    return referenceTime + Math.floor((time - referenceTime) / STEP_LENGTH) * STEP_LENGTH
}

let hasBeenInit = false

let name = prompt("Display name", "Shefler")

function openSocket() {
    let url = ((location.protocol === "http:" || location.hostname === "localhost") ? "ws:" : "wss:") + location.host + location.pathname
    ws = new WebSocket(url + "socket")

    window.ws = ws;

    let sendTime: number
    ws.onopen = () => {
        sendTime = Date.now()
        ws.send(JSON.stringify({
            type: "init",
            data: {
                name: name
            }
        }))
    }

    ws.onmessage = (event) => { // If the message is giving the initial state and the game can now start displaying
        // Set the state to be the initial state
        let eventData = JSON.parse(event.data) as EventData
        if (eventData.type == "init") {
            const data = eventData.data as InitData

            let id = data.id ?? clientInputRecord.id
            let oldClientInputRecord = clientInputRecord

            inputRecords.clear()
            for(let inputRecord of data.inputRecords){
                inputRecords.set(inputRecord.id, deserializeInputRecord(inputRecord))
            }
            setClientInputRecord(inputRecords.get(id) as InputRecord)

            const state = deserializeState(data.state)
            stateHistory.set(state.time, state)
            setCurrentState(state)

            if(oldClientInputRecord) {
                clientInputRecord.inputs.push(...oldClientInputRecord.inputs.filter((input) => input.time >= state.time))
            }


            if(data.time) {
                setCurrentTime(data.time + (Date.now() - sendTime)/2)
            }

            for(let [key] of stateHistory){
                if(key < state.time){
                    stateHistory.delete(key)
                }
            }

            if(!hasBeenInit) {
                referenceTime = state.time
                startListening()
                loop()
            }

            window.exposed.stateHistory = stateHistory
            window.exposed.inputRecords = inputRecords
        } else if (eventData.type == "input") {
            const data = eventData.data as InputData

            if(data.id != clientInputRecord.id) {
                const input = new Input(data.time, data.inputType); // THIS SEMICOLON IS NECESSARY!!!
                (inputRecords.get(data.id) as InputRecord).inputs.push(input)
                // console.log(inputRecords.get(data.id) as InputRecord)
                // console.log("Input at " + data.time)
                const roundedTime = referenceTime + Math.floor((data.time - referenceTime) / STEP_LENGTH) * STEP_LENGTH
                if (roundedTime < currentState.time) {
                    setCurrentState(stateHistory.get(roundedTime) as State)
                    // console.log("Reset to " + currentState.time)
                }
            }
        } else if (eventData.type == "join") {
            const data = eventData.data as JoinData

            if(data.id != clientInputRecord.id) {

                const inputRecord = new InputRecord(data.id)
                inputRecords.set(data.id, inputRecord)
                const player = deserializePlayer(data.player)
                clientStateEvents.push(new JoinEvent(data.time, player))

                const roundedTime = roundTime(data.time)
                if (roundedTime < currentState.time) {
                    setCurrentState(stateHistory.get(roundedTime) as State)
                }
            }
        } else if (eventData.type === "disconnect") {
            const data = eventData.data as DisconnectData

            clientStateEvents.push(new DisconnectEvent(data.time, data.id))
        }
        // Handle other events like player creation and deletion, or other stuff
    }
}

export {ws, openSocket}