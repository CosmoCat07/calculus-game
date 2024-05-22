import State from "./State.js"
import InputRecord from "./InputRecord.js"

export class ServerState {
    state = new State(new Date().getTime())
    inputRecords = new Map<number, InputRecord>()
    playersJoined = 0
}