import { STEP_LENGTH } from "./constants.js";
export default class State {
    constructor(time, players, bullets) {
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
    draw() {
        for (const player of this.players) {
            player.draw();
        }
        for (const bullet of this.bullets) {
            bullet.draw(this.time);
        }
    }
    duplicate() {
        // #TODO THIS IS WRONG
        return new State(this.time, this.players, this.bullets);
    }
}
