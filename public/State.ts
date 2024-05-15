import Player from "./Player.js";
import Bullet from "./Bullet.js";
import {STEP_LENGTH} from "./constants.js";

export default class State {
    players: Set<Player>
    bullets: Set<Bullet>
    time: number

    constructor(time: number, players: Set<Player>, bullets: Set<Bullet>) {
        this.time = time
        this.players = players
        this.bullets = bullets
    }

    step(){
        this.time += STEP_LENGTH
        for(const player of this.players){
            player.move()
        }
        for(const player of this.players){
            player.collide()
        }
    }

    draw() {
        for(const player of this.players){
            player.draw()
        }
        for(const bullet of this.bullets){
            bullet.draw()
        }
    }

    duplicate(): State{
        // #TODO THIS IS WRONG
        return new State(this.time, this.players, this.bullets)
    }
}