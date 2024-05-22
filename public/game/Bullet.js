export default class Bullet {
    constructor(x, y, xVel, yVel, startTime, summonerId) {
        this.startX = x;
        this.startY = y;
        this.xVel = xVel;
        this.yVel = yVel;
        this.startTime = startTime;
        this.summonerId = summonerId;
    }
}
