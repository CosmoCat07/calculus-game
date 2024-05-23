import Player from "../game/Player.js";
import {CAMERA_ACCELERATION, CAMERA_FRICTION} from "../game/constants.js";

export default class Camera {
    x = 0
    y = 0
    xVel = 0
    yVel = 0
    step(player: Player){
        this.xVel *= CAMERA_FRICTION
        this.yVel *= CAMERA_FRICTION
        this.xVel += (player.x - this.x)*CAMERA_ACCELERATION
        this.yVel += (player.y - this.y)*CAMERA_ACCELERATION
        this.x += this.xVel
        this.y += this.yVel
    }
}