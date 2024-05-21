import InputRecord from "./public/game/InputRecord.js"
import Input from "./public/game/Input.js"
import Player from "./public/game/Player.js"
import Bullet from "./public/game/Bullet.js"
import State from "./public/game/State.js"
import {
    SerializedBullet,
    SerializedInput,
    SerializedInputRecord,
    SerializedPlayer, SerializedState
} from "./public/game/SerializedObjects.js"



export function serializeInput(input: Input): SerializedInput{
    return {
        time: input.time,
        type: input.type,
    }
}

export function serializeInputRecord(inputRecord: InputRecord): SerializedInputRecord {
    let serializedInputs = []
    for(let input of inputRecord.inputs){
        serializedInputs.push(serializeInput(input))
    }
    return {
        id: inputRecord.id,
        inputs: serializedInputs,
    }
}

export function serializePlayer(player: Player): SerializedPlayer {
    return {
        x: player.x, y: player.y,
        xVel: player.xVel, yVel: player.yVel,
        rot: player.rot, rotVel: player.rotVel,
        shootProgress: player.shootProgress,
        turn: player.turn, move: player.move, slide: player.slide,
        inputId: player.inputs.id
    }
}

export function serializeBullet(bullet: Bullet): SerializedBullet {
    return {
        startX: bullet.startX,
        startY: bullet.startY,
        xVel: bullet.xVel,
        yVel: bullet.yVel,
        startTime: bullet.startTime,
    }
}

export function serializeState(state: State): SerializedState {
    let serializedPlayers = []
    for(let player of state.players){
        serializedPlayers.push(serializePlayer(player))
    }
    let serializedBullets = []
    for(let bullet of state.bullets){
        serializedBullets.push(serializeBullet(bullet))
    }
    return {
        time: state.time,
        players: serializedPlayers,
        bullets: serializedBullets
    }
}