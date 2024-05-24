import InputType from "../game/InputType.js";

export type SerializedInput = {
    time: number
    type: InputType
}

export type SerializedInputRecord = {
    id: number,
    inputs: Array<SerializedInput>,
}

export type SerializedPlayer = {
    x: number, y: number,
    xVel: number, yVel: number,
    rot: number, rotVel: number,
    shootProgress: number,
    turn: number, move: number, slide: number,
    inputId: number,
    hp: number, kills: number,
    name: string, active: boolean
}

export type SerializedBullet = {
    startX: number,
    startY: number,
    xVel: number,
    yVel: number,
    startTime: number,
    summonerId: number,
}

export type SerializedState = {
    time: number,
    players: Array<SerializedPlayer>,
    bullets: Array<SerializedBullet>,
    mode: "deathmatch" | "elimination"
}