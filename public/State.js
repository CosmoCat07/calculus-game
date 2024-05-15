import { STEP_LENGTH } from "./constants.js";
export default class State {
    constructor(time, players, bullets) {
        this.time = time;
        this.players = players;
        this.bullets = bullets;
    }
    step() {
        this.time += STEP_LENGTH;
        for (const player of this.players) {
            player.move();
        }
        for (const player of this.players) {
            player.collide();
        }
    }
    draw() {
        for (const player of this.players) {
            player.draw();
        }
        for (const bullet of this.bullets) {
            bullet.draw();
        }
    }
    duplicate() {
        // #TODO THIS IS WRONG
        return new State(this.time, this.players, this.bullets);
    }
}
