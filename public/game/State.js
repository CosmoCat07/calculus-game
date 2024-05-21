import { STEP_LENGTH } from "./constants.js";
export default class State {
    constructor(time = 0, players = new Set(), bullets = new Set()) {
        this.time = time;
        this.players = players;
        this.bullets = bullets;
    }
    step() {
        for (const player of this.players) {
            player.update(this);
        }
        for (const player of this.players) {
            player.collide();
        }
        this.time += STEP_LENGTH;
    }
    duplicate() {
        // #TODO THIS IS WRONG
        return new State(this.time, this.players, this.bullets);
    }
}
// export type SerializedState = {
//     players: Array<SerializedPlayers>
//     bullets: Array<Bullet>
// }
