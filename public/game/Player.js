import { BULLET_SPEED, DASH_POW, FRICTION, ROT_FRICTION, ROT_SPEED, SIZE, SLIDE_FRICTION, SPEED, STEP_LENGTH } from "./constants.js";
import inputTypes from "./inputTypes.js";
import { ctx } from "../client/canvas.js";
import { shefler } from "../client/sprites.js";
import Bullet from "./Bullet.js";
export default class Player {
    constructor(x, y, xVel, yVel, inputs) {
        this.turn = 0;
        this.move = 0;
        this.slide = 0;
        this.rot = 0;
        this.rotVel = 0;
        this.x = x;
        this.y = y;
        this.xVel = xVel;
        this.yVel = yVel;
        this.inputs = inputs;
    }
    dash() {
        this.xVel = DASH_POW * Math.cos(this.rot);
        this.yVel = DASH_POW * Math.sin(this.rot);
    }
    shoot(state) {
        state.bullets.add(new Bullet(this.x, this.y, BULLET_SPEED * Math.cos(this.rot), BULLET_SPEED * Math.sin(this.rot), state.time));
        this.xVel -= 2 * Math.cos(this.rot);
        this.yVel -= 2 * Math.sin(this.rot);
    }
    update(state) {
        for (let input of this.inputs.actions) {
            if (state.time <= input.time && input.time < state.time + STEP_LENGTH) {
                switch (input.type) {
                    case inputTypes.FORWARD:
                        this.move = 1;
                        break;
                    case inputTypes.STOP:
                        this.move = 0;
                        break;
                    case inputTypes.LEFT:
                        this.turn = -1;
                        break;
                    case inputTypes.RIGHT:
                        this.turn = 1;
                        break;
                    case inputTypes.STRAIGHT:
                        this.turn = 0;
                        break;
                    case inputTypes.DASH:
                        this.dash();
                        this.slide = 1;
                        break;
                    case inputTypes.END_DASH:
                        this.slide = 0;
                        break;
                    case inputTypes.SHOOT:
                        this.shoot(state);
                        break;
                }
            }
        }
        let friction = this.slide * SLIDE_FRICTION + (1 - this.slide) * FRICTION;
        this.xVel *= friction;
        this.yVel *= friction;
        let accel = SPEED * (1 - this.slide) * this.move;
        this.xVel += accel * Math.cos(this.rot);
        this.yVel += accel * Math.sin(this.rot);
        this.rotVel *= ROT_FRICTION;
        this.rotVel += ROT_SPEED * this.turn;
    }
    collide() {
        this.x += this.xVel;
        this.y += this.yVel;
        this.rot += this.rotVel;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot + Math.PI / 2);
        ctx.scale(SIZE, SIZE);
        ctx.drawImage(shefler, -shefler.width / shefler.height / 2, -1 / 2, shefler.width / shefler.height, 1);
        ctx.restore();
    }
}
