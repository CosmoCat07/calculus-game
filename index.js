import express from "express";
import Player from "./public/game/Player.js";
import InputRecord from "./public/game/InputRecord.js";
import { serializeInputRecord, serializeState } from "./public/serialization/serialize.js";
import { ServerState } from "./public/game/ServerState.js";
import { deserializeInput } from "./public/serialization/deserialize.js";
import WebSocket from 'ws';
import { STEP_LENGTH } from "./public/game/constants.js";
const port = 3000;
const app = express();
app.use(express.static('public', { index: "./client/index.html" }));
const serverState = new ServerState();
const socketList = new Array();
const server = new WebSocket.Server({ server: app.listen(port) });
server.on('connection', (ws) => {
    socketList.push(ws);
    const id = serverState.playersJoined;
    serverState.playersJoined++;
    const newInputRecord = new InputRecord(id);
    serverState.inputRecords.set(id, serializeInputRecord(newInputRecord));
    const newPlayer = new Player(newInputRecord);
    serverState.state.players.add(newPlayer);
    const serializedInputRecords = new Array();
    for (let inputRecord of serverState.inputRecords.values()) {
        serializedInputRecords.push(serializeInputRecord(inputRecord));
    }
    ws.send(JSON.stringify({
        type: "init",
        data: {
            id: id,
            state: serializeState(serverState.state),
            inputRecords: serializedInputRecords,
        },
    }));
    ws.on('message', (dataRaw) => {
        const dataString = dataRaw.toString();
        const dataProcessed = JSON.parse(dataString);
        if (dataProcessed.type === "input") {
            const data = dataProcessed.data;
            const input = deserializeInput(data.input);
            serverState.inputRecords.get(id).inputs.push(input);
            console.log(serverState.inputRecords.get(id));
            let oldestInput = serverState.state.time;
            for (let inputRecord of serverState.inputRecords.values()) {
                oldestInput = Math.min(inputRecord.inputs[inputRecord.inputs.length - 1].time);
            }
            while (serverState.state.time + STEP_LENGTH < oldestInput) {
                serverState.state.step();
            }
            socketList.forEach((socket) => socket.send(JSON.stringify({
                type: "input",
                data: {
                    id: id,
                    time: data.input.time,
                    inputType: data.input.type,
                }
            })));
        }
    });
});
