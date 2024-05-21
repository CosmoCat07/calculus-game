import Player, {SerializedPlayer} from "./Player.js"
import Bullet, {SerializedBullet} from "./Bullet.js"
import {STEP_LENGTH} from "./constants.js"

export default class State {
    players: Set<Player>
    bullets: Set<Bullet>
    time: number

    constructor(time = 0, players: Set<Player> = new Set<Player>(), bullets: Set<Bullet> = new Set<Bullet>()) {
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

    duplicate(): State{
        // #TODO THIS IS WRONG
        return new State(this.time, this.players, this.bullets)
    }

    serialize() : SerializedState{
        let serializedPlayers = []
        for(let player of this.players){
            serializedPlayers.push(player.serialize())
        }
        let serializedBullets = []
        for(let bullet of this.bullets){
            serializedBullets.push(bullet.serialize())
        }
        return {
            time: this.time,
            players: serializedPlayers,
            bullets: serializedBullets
        }
    }
}

export type SerializedState = {
    time: number,
    players: Array<SerializedPlayer>,
    bullets: Array<SerializedBullet>,
}