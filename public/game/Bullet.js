import { ctx } from "../client/canvas.js";
import { BULLET_SIZE } from "./constants.js";
export default class Bullet {
    constructor(x, y, xVel, yVel, startTime) {
        this.startX = x;
        this.startY = y;
        this.xVel = xVel;
        this.yVel = yVel;
        this.startTime = startTime;
    }
    draw(now) {
        ctx.beginPath();
        ctx.arc(this.startX + this.xVel * (now - this.startTime), this.startY + this.yVel * (now - this.startTime), BULLET_SIZE, 0, 2 * Math.PI);
        ctx.fillStyle = "brown";
        ctx.fill();
    }
}
