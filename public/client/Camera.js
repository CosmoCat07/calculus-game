import { CAMERA_ACCELERATION, CAMERA_FRICTION } from "../game/constants.js";
export default class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.xVel = 0;
        this.yVel = 0;
    }
    step(player) {
        this.xVel *= CAMERA_FRICTION;
        this.yVel *= CAMERA_FRICTION;
        this.xVel += (player.x - this.x) * CAMERA_ACCELERATION;
        this.yVel += (player.y - this.y) * CAMERA_ACCELERATION;
        this.x += this.xVel;
        this.y += this.yVel;
    }
}
