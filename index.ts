import express from "express"
import Player from "./public/game/Player.js";
import InputRecord from "./public/game/InputRecord.js";
import {serializeInputRecord, serializePlayer, serializeState} from "./public/serialization/serialize.js";
import {ServerState} from "./ServerState.js";
import {SerializedInput, SerializedInputRecord} from "./public/serialization/SerializedObjects.js";
import {deserializeInput} from "./public/serialization/deserialize.js";
import WebSocket from 'ws';
import {MAX_ROLLBACK, STEP_LENGTH} from "./public/game/constants.js";
import {inputRecords} from "./public/client/inputRecords.js";
import {currentState} from "./public/client/currentState.js";
const port = 3000

const app = express()

app.use(express.static('public', {index: "./client/index.html"}))

const serverState = new ServerState()

interface EventData {
    type: "input" | "init" | "modeChange"
    data: InputData | InitData | ModeChangeData
}

interface InputData {
    input: SerializedInput
}

interface InitData {
    name: string
}

interface ModeChangeData {}

const socketList = new Set<WebSocket>()

function sendAll(message: String){
    socketList.forEach((socket) => socket.send(message))
}

const server = new WebSocket.Server({server: app.listen(port)})

async function delay(time: number){
    return new Promise<number>(resolve => setTimeout(resolve, time))
}

setInterval(() => {
    while(serverState.state.time + STEP_LENGTH < Date.now() - MAX_ROLLBACK){
        serverState.state.step()
    }
    const serializedInputRecords = new Array<SerializedInputRecord>()
    for(let inputRecord of serverState.inputRecords.values()){
        while(inputRecord.inputs[0] && inputRecord.inputs[0].time < serverState.state.time){
            inputRecord.inputs.shift()
        }
        serializedInputRecords.push(serializeInputRecord(inputRecord))
    }
    sendAll(JSON.stringify({
        type: "init",
        data: {
            state: serializeState(serverState.state),
            inputRecords: serializedInputRecords,
        },
    }))
}, 1000)

server.on('connection', (ws) => {

    const id = serverState.playersJoined
    serverState.playersJoined++

    ws.on('message', async (dataRaw: Buffer) => {
        // await delay(200)
        const dataString = dataRaw.toString()
        const dataProcessed = JSON.parse(dataString) as EventData
        if (dataProcessed.type == "init"){
            const data = dataProcessed.data as InitData

            const newInputRecord = new InputRecord(id)
            serverState.inputRecords.set(id, newInputRecord)

            const newPlayer = new Player(newInputRecord, data.name, serverState.state.mode == "deathmatch")
            serverState.state.players.add(newPlayer)

            sendAll(JSON.stringify({
                type: "join",
                data: {
                    id: id,
                    time: Date.now(),
                    player: serializePlayer(newPlayer),
                }
            }))
            socketList.add(ws)
            const serializedInputRecords = new Array<SerializedInputRecord>()
            for(let inputRecord of serverState.inputRecords.values()){
                serializedInputRecords.push(serializeInputRecord(inputRecord))
            }
            ws.send(JSON.stringify({
                type: "init",
                data: {
                    id: id,
                    time: Date.now(), //new Date().getTime(),
                    state: serializeState(serverState.state),
                    inputRecords: serializedInputRecords,
                },
            }))
        }
        if (dataProcessed.type === "input") {
            const data = dataProcessed.data as InputData
            const input = deserializeInput(data.input);
            if(input.time >= serverState.state.time){
                (serverState.inputRecords.get(id) as InputRecord).inputs.push(input)

                sendAll(JSON.stringify({
                    type: "input",
                    data: {
                        id: id,
                        time: data.input.time,
                        inputType: data.input.type,
                    }
                }))
            }
        }
        if (dataProcessed.type == "modeChange"){
            if(serverState.state.mode == "deathmatch") {
                serverState.state.mode = "elimination"
                serverState.state.players.forEach((player) => {
                    player.hp = Math.max(1, player.kills)
                })
            }else{
                serverState.state.mode = "deathmatch"
                serverState.state.players.forEach((player) => {
                    if(!player.active) {
                        player.active = true
                        player.x = 0
                        player.y = 0
                    }
                })
            }
            console.log(serverState.state.mode)
        }
    })
    ws.on('close', () => {
        serverState.state.players.forEach((player) => {
            if(player.inputRecord.id == id){
                serverState.state.players.delete(player)
            }
        })
        socketList.delete(ws)
        sendAll(JSON.stringify({type: "disconnect",
        data: {
            id: id,
            time: Date.now()
        }}))
    })
})