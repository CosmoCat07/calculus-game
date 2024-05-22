import express from "express"
import State from "./public/game/State.js";
import Player from "./public/game/Player.js";
import InputRecord from "./public/game/InputRecord.js";
import {serializeInputRecord, serializeState} from "./public/serialization/serialize.js";
import {inputRecords} from "./public/client/inputRecords.js";
import {ServerState} from "./public/game/ServerState.js";
import {SerializedInput, SerializedInputRecord} from "./public/serialization/SerializedObjects.js";
import {deserializeInput} from "./public/serialization/deserialize.js";
import Input from "./public/game/Input.js";
import WebSocket from 'ws';
import {STEP_LENGTH} from "./public/game/constants.js";
const port = 3000

const app = express()

app.use(express.static('public', {index: "./client/index.html"}))

const serverState = new ServerState()

interface EventData {
    type: "input"
    data: InputData
}

interface InputData {
    input: SerializedInput
}

const socketList = new Array<WebSocket>()

const server = new WebSocket.Server({server: app.listen(port)});

server.on('connection', (ws) => {
    socketList.push(ws)

    const id = serverState.playersJoined
    serverState.playersJoined++

    const newInputRecord = new InputRecord(id)
    serverState.inputRecords.set(id, serializeInputRecord(newInputRecord))
    const newPlayer = new Player(newInputRecord)
    serverState.state.players.add(newPlayer)

    const serializedInputRecords = new Array<SerializedInputRecord>()
    for(let inputRecord of serverState.inputRecords.values()){
        serializedInputRecords.push(serializeInputRecord(inputRecord))
    }
    ws.send(JSON.stringify({
        type: "init",
        data: {
            id: id,
            state: serializeState(serverState.state),
            inputRecords: serializedInputRecords,
        },
    }))
    ws.on('message', (dataRaw: Buffer) => {
        const dataString = dataRaw.toString()
        const dataProcessed = JSON.parse(dataString) as EventData
        if (dataProcessed.type === "input") {
            const data = dataProcessed.data as InputData
            const input = deserializeInput(data.input);
            (serverState.inputRecords.get(id) as InputRecord).inputs.push(input)

            let oldestInput = serverState.state.time
            for(let inputRecord of serverState.inputRecords.values()){
                oldestInput = Math.min(inputRecord.inputs[inputRecord.inputs.length - 1].time)
            }
            while(serverState.state.time + STEP_LENGTH < oldestInput){
                serverState.state.step()
            }

            socketList.forEach((socket) => socket.send(dataString))
        }
    })
})