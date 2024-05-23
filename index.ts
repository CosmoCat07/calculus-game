import express from "express"
import Player from "./public/game/Player.js";
import InputRecord from "./public/game/InputRecord.js";
import {serializeInputRecord, serializePlayer, serializeState} from "./public/serialization/serialize.js";
import {ServerState} from "./ServerState.js";
import {SerializedInput, SerializedInputRecord} from "./public/serialization/SerializedObjects.js";
import {deserializeInput} from "./public/serialization/deserialize.js";
import WebSocket from 'ws';
import {STEP_LENGTH} from "./public/game/constants.js";
const port = 3000

const app = express()

app.use(express.static('public', {index: "./client/index.html"}))

const serverState = new ServerState()

interface EventData {
    type: "input" | "init"
    data: InputData | InitData
}

interface InputData {
    input: SerializedInput
}

interface InitData {}

const socketList = new Set<WebSocket>()

function sendAll(message: String){
    socketList.forEach((socket) => socket.send(message))
}

const server = new WebSocket.Server({server: app.listen(port)})

async function delay(time: number){
    return new Promise<number>(resolve => setTimeout(resolve, time))
}

setInterval(() => {
    // while(serverState.state.time + STEP_LENGTH < oldestInput){
    //     // console.log(serverState.state.time + " to " + (serverState.state.time + STEP_LENGTH))
    //     serverState.state.step()
    // }
    const serializedInputRecords = new Array<SerializedInputRecord>()
    for(let inputRecord of serverState.inputRecords.values()){
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

            const newInputRecord = new InputRecord(id)
            serverState.inputRecords.set(id, newInputRecord)

            const newPlayer = new Player(newInputRecord)
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
            (serverState.inputRecords.get(id) as InputRecord).inputs.push(input)
            // console.log((serverState.inputRecords.get(id)))

            let oldestInput = serverState.state.time
            for(let inputRecord of serverState.inputRecords.values()){
                if(inputRecord.inputs.length > 0) {
                    oldestInput = Math.min(inputRecord.inputs[inputRecord.inputs.length - 1].time)
                }
            }
            while(serverState.state.time + STEP_LENGTH < oldestInput){
                // console.log(serverState.state.time + " to " + (serverState.state.time + STEP_LENGTH))
                serverState.state.step()
            }

            sendAll(JSON.stringify({
                type: "input",
                data: {
                    id: id,
                    time: data.input.time,
                    inputType: data.input.type,
                }
            }))
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