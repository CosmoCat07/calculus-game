import Player from "./Player.js"
import Bullet from "./Bullet.js"
import {STEP_LENGTH} from "./constants.js"

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
        for(const player of this.players){
            player.update(this)
        }
        for(const player of this.players){
            player.collide()
        }
        this.time += STEP_LENGTH
    }

    draw() {
        for(const bullet of this.bullets){
            bullet.draw(this.time)
        }
        for(const player of this.players){
            player.draw()
        }
    }

    duplicate(): State{
        // #TODO THIS IS WRONG
        return new State(this.time, this.players, this.bullets)
    }
}