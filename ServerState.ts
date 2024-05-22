import State from "./public/game/State.js"
import InputRecord from "./public/game/InputRecord.js"

export class ServerState {
    state = new State(new Date().getTime())
    inputRecords = new Map<number, InputRecord>()
    playersJoined = 0
}