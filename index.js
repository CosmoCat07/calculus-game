var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import Player from "./public/game/Player.js";
import InputRecord from "./public/game/InputRecord.js";
import { serializeInputRecord, serializePlayer, serializeState } from "./public/serialization/serialize.js";
import { ServerState } from "./ServerState.js";
import { deserializeInput } from "./public/serialization/deserialize.js";
import WebSocket from 'ws';
import { MAX_ROLLBACK, STEP_LENGTH } from "./public/game/constants.js";
const port = 3000;
const app = express();
app.use(express.static('public', { index: "./client/index.html" }));
const serverState = new ServerState();
const socketList = new Set();
function sendAll(message) {
    socketList.forEach((socket) => socket.send(message));
}
const server = new WebSocket.Server({ server: app.listen(port) });
function delay(time) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => setTimeout(resolve, time));
    });
}
setInterval(() => {
    while (serverState.state.time + STEP_LENGTH < Date.now() - MAX_ROLLBACK) {
        serverState.state.step();
    }
    const serializedInputRecords = new Array();
    for (let inputRecord of serverState.inputRecords.values()) {
        serializedInputRecords.push(serializeInputRecord(inputRecord));
    }
    sendAll(JSON.stringify({
        type: "init",
        data: {
            state: serializeState(serverState.state),
            inputRecords: serializedInputRecords,
        },
    }));
}, 1000);
server.on('connection', (ws) => {
    const id = serverState.playersJoined;
    serverState.playersJoined++;
    ws.on('message', (dataRaw) => __awaiter(void 0, void 0, void 0, function* () {
        // await delay(200)
        const dataString = dataRaw.toString();
        const dataProcessed = JSON.parse(dataString);
        if (dataProcessed.type == "init") {
            const data = dataProcessed.data;
            const newInputRecord = new InputRecord(id);
            serverState.inputRecords.set(id, newInputRecord);
            const newPlayer = new Player(newInputRecord, data.name, serverState.state.mode == "deathmatch");
            serverState.state.players.add(newPlayer);
            sendAll(JSON.stringify({
                type: "join",
                data: {
                    id: id,
                    time: Date.now(),
                    player: serializePlayer(newPlayer),
                }
            }));
            socketList.add(ws);
            const serializedInputRecords = new Array();
            for (let inputRecord of serverState.inputRecords.values()) {
                serializedInputRecords.push(serializeInputRecord(inputRecord));
            }
            ws.send(JSON.stringify({
                type: "init",
                data: {
                    id: id,
                    time: Date.now(), //new Date().getTime(),
                    state: serializeState(serverState.state),
                    inputRecords: serializedInputRecords,
                },
            }));
        }
        if (dataProcessed.type === "input") {
            const data = dataProcessed.data;
            const input = deserializeInput(data.input);
            if (input.time >= serverState.state.time) {
                serverState.inputRecords.get(id).inputs.push(input);
                sendAll(JSON.stringify({
                    type: "input",
                    data: {
                        id: id,
                        time: data.input.time,
                        inputType: data.input.type,
                    }
                }));
            }
        }
        if (dataProcessed.type == "modeChange") {
            if (serverState.state.mode == "deathmatch") {
                serverState.state.mode = "elimination";
                serverState.state.players.forEach((player) => {
                    player.hp = Math.max(1, player.kills);
                });
            }
            else {
                serverState.state.mode = "deathmatch";
                serverState.state.players.forEach((player) => {
                    if (!player.active) {
                        player.active = true;
                        player.x = 0;
                        player.y = 0;
                    }
                });
            }
            console.log(serverState.state.mode);
        }
    }));
    ws.on('close', () => {
        serverState.state.players.forEach((player) => {
            if (player.inputRecord.id == id) {
                serverState.state.players.delete(player);
            }
        });
        socketList.delete(ws);
        sendAll(JSON.stringify({ type: "disconnect",
            data: {
                id: id,
                time: Date.now()
            } }));
    });
});
