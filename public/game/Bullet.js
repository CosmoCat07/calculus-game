import { SIZE_PER_PLAYER } from "./constants.js";
export default class Bullet {
    constructor(x, y, xVel, yVel, startTime, summonerId) {
        this.startX = x;
        this.startY = y;
        this.xVel = xVel;
        this.yVel = yVel;
        this.startTime = startTime;
        this.summonerId = summonerId;
    }
    update(state) {
        const x = this.startX + this.xVel * (state.time - this.startTime);
        const y = this.startY + this.yVel * (state.time - this.startTime);
        const mapRadius = Math.sqrt(state.players.size * SIZE_PER_PLAYER);
        if (Math.sqrt(x ** 2 + y ** 2) > mapRadius) {
            state.bullets.delete(this);
        }
    }
}
