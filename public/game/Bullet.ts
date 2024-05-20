import {ctx} from "../client/canvas.js"
import {BULLET_SIZE} from "./constants.js"

export default class Bullet {
    startX: number
    startY: number
    xVel: number
    yVel: number
    startTime: number
    constructor(
        x: number, y: number,
        xVel: number, yVel: number,
        startTime: number,
    ) {
        this.startX = x
        this.startY = y

        this.xVel = xVel
        this.yVel = yVel

        this.startTime = startTime
    }

    draw(now: number) {
        ctx.beginPath()
        ctx.arc(
            this.startX + this.xVel*(now - this.startTime),
            this.startY + this.yVel*(now - this.startTime),
            BULLET_SIZE, 0, 2*Math.PI
        )
        ctx.fillStyle = "brown"
        ctx.fill()
    }
}