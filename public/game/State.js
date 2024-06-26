import { STEP_LENGTH } from "./constants.js";
export default class State {
    constructor(time = 0, players = new Set(), bullets = new Set(), mode = "deathmatch") {
        this.time = time;
        this.players = players;
        this.bullets = bullets;
        this.mode = mode;
    }
    step() {
        for (const player of this.players) {
            player.update(this);
        }
        for (const player of this.players) {
            player.collide(this);
        }
        for (const bullet of this.bullets) {
            bullet.update(this);
        }
        this.time += STEP_LENGTH;
    }
    duplicate() {
        const players = [];
        for (const player of this.players) {
            players.push(player.copy());
        }
        const bullets = [];
        for (const bullet of this.bullets) {
            bullets.push(bullet);
        }
        return new State(this.time, new Set(players), new Set(bullets), this.mode);
    }
}
