
export default class Bullet {
    startX: number
    startY: number
    xVel: number
    yVel: number
    constructor(
        x: number, y: number,
        xVel: number, yVel: number,
    ) {
        this.startX = x
        this.startY = y

        this.xVel = xVel
        this.yVel = yVel
    }

    draw() {

    }
}