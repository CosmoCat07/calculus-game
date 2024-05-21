import express from "express"
import expressWs from "express-ws"
import State from "./public/game/State.js";
import Player from "./public/game/Player.js";
import InputRecord from "./public/game/InputRecord.js";
import {serializeState} from "./serialize.js";

const port = 3000

const app = expressWs(express()).app

app.use(express.static('public', {index: "./client/index.html"}))

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

app.ws('/socket', (ws) => {
    ws.send(JSON.stringify(serializeState(new State())));
    ws.on('connection', () => {
        console.log("Successfully Connected")
    })
    ws.on('message', (msg) => {
        console.log(msg)
    })
    ws.emit("connection")

})