import State from "./public/game/State.js";
export class ServerState {
    constructor() {
        this.state = new State(new Date().getTime());
        this.inputRecords = new Map();
        this.playersJoined = 0;
    }
}
