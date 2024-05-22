import State from "../game/State.js";
import Player from "../game/Player.js";

export interface StateEvent {
    time: number
    activate(state: State): void
}

export class JoinEvent implements StateEvent {
    time: number
    player: Player
    constructor(time: number, player: Player){
        this.time = time
        this.player = player
    }
    activate(state: State){
        state.players.add(this.player.copy())
    }
}