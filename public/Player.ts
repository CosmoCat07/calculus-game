import InputRecord from "./InputRecord.js";

export default class Player {
    inputs: InputRecord
    x: number
    y: number
    xVel: number
    yVel: number

    constructor(x: number, y: number, xVel: number, yVel: number, inputs: InputRecord) {
        this.x = x
        this.y = y
        this.xVel = xVel
        this.yVel = yVel
        this.inputs = inputs
    }

    move(){

    }

    collide() {

    }

    draw(){

    }
}