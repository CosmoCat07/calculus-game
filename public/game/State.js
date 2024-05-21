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
    serialize() {
        let serializedPlayers = [];
        for (let player of this.players) {
            serializedPlayers.push(player.serialize());
        }
        let serializedBullets = [];
        for (let bullet of this.bullets) {
            serializedBullets.push(bullet.serialize());
        }
        return {
            time: this.time,
            players: serializedPlayers,
            bullets: serializedBullets
        };
    }
}
