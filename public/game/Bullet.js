export default class Bullet {
    constructor(x, y, xVel, yVel, startTime) {
        this.startX = x;
        this.startY = y;
        this.xVel = xVel;
        this.yVel = yVel;
        this.startTime = startTime;
    }
    serialize() {
        return {
            startX: this.startX,
            startY: this.startY,
            xVel: this.xVel,
            yVel: this.yVel,
            startTime: this.startTime,
        };
    }
}
