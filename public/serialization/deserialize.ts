import Input from "../game/Input.js";
import InputRecord from "../game/InputRecord.js";
import {
    SerializedBullet,
    SerializedInput,
    SerializedInputRecord,
    SerializedPlayer,
    SerializedState
} from "./SerializedObjects.js";
import {inputRecords} from "../client/inputRecords.js";
import Player from "../game/Player.js";
import Bullet from "../game/Bullet.js";
import State from "../game/State.js";


export function deserializeInput(input: SerializedInput) {
    return new Input(input.time, input.type)
}


export function deserializeInputRecord(inputRecord: SerializedInputRecord) {
    const inputs = []
    for(let input of inputRecord.inputs){
        inputs.push(deserializeInput(input))
    }
    return new InputRecord(
        inputRecord.id,
        inputs,
    )
}

export function deserializePlayer(player: SerializedPlayer) {
    return new Player(inputRecords.get(player.inputId), player.name, player.active, player.x, player.y, player.xVel, player.yVel, player.rot, player.rotVel, player.shootProgress, player.turn, player.move, player.slide, player.hp, player.kills)
}

export function deserializeBullet(bullet: SerializedBullet){
    return new Bullet(
        bullet.startX, bullet.startY,
        bullet.xVel, bullet.yVel,
        bullet.startTime,
        bullet.summonerId
    )
}

export function deserializeState(state: SerializedState) {
    const players = new Set<Player>()
    for(let player of state.players){
        players.add(deserializePlayer(player))
    }
    const bullets = new Set<Bullet>()
    for(let bullet of state.bullets){
        bullets.add(deserializeBullet(bullet))
    }
    return new State(state.time, players, bullets, state.mode)
}