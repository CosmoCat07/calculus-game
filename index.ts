import express from "express"
import expressWs from "express-ws"
import State from "./public/game/State.js";
import Player from "./public/game/Player.js";
import InputRecord from "./public/game/InputRecord.js";
import {serializeInputRecord, serializeState} from "./serialize.js";
import {inputRecords} from "./public/client/inputRecords.js";

const port = 3000

const app = expressWs(express()).app

app.use(express.static('public', {index: "./client/index.html"}))

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

app.ws('/socket', (ws) => {
    const id = 0
    const newInputRecord = new InputRecord(0)
    const newPlayer = new Player(newInputRecord)
    ws.send(JSON.stringify({
        type: "init",
        data: {
            id: 0,
            state: serializeState(new State(new Date().getTime(), new Set([newPlayer]))),
            inputRecords: [serializeInputRecord(new InputRecord(0))],
        },
    }))
    ws.on('connection', () => {
        console.log("Successfully Connected")
    })
    ws.on('message', (msg) => {
        console.log(msg)
    })
    ws.emit("connection")

})