import InputRecord from "./InputRecord.js";
import { BULLET_SPEED, DASH_POW, FRICTION, ROT_FRICTION, ROT_SPEED, SHOOT_POINT, SHOOT_TIME, SLIDE_FRICTION, SPEED, STEP_LENGTH } from "./constants.js";
import InputType from "./InputType.js";
import Bullet from "./Bullet.js";
export default class Player {
    constructor(inputs = new InputRecord(0), x = 0, y = 0, xVel = 0, yVel = 0, rot = 0, rotVel = 0, shootProgress = 1, turn = 0, move = 0, slide = 0) {
        this.x = x;
        this.y = y;
        this.xVel = xVel;
        this.yVel = yVel;
        this.rot = rot;
        this.rotVel = rotVel;
        this.shootProgress = shootProgress;
        this.turn = turn;
        this.move = move;
        this.slide = slide;
        this.inputRecord = inputs;
    }
    dash() {
        this.xVel = DASH_POW * Math.cos(this.rot);
        this.yVel = DASH_POW * Math.sin(this.rot);
    }
    shoot(state) {
        this.shootProgress = 0;
        // this.xVel -= 2*Math.cos(this.rot)
        // this.yVel -= 2*Math.sin(this.rot)
    }
    update(state) {
        for (let input of this.inputRecord.inputs) {
            if (state.time <= input.time && input.time < state.time + STEP_LENGTH) {
                switch (input.type) {
                    case InputType.FORWARD:
                        this.move = 1;
                        break;
                    case InputType.STOP:
                        this.move = 0;
                        break;
                    case InputType.LEFT:
                        this.turn = -1;
                        break;
                    case InputType.RIGHT:
                        this.turn = 1;
                        break;
                    case InputType.STRAIGHT:
                        this.turn = 0;
                        break;
                    case InputType.DASH:
                        this.dash();
                        this.slide = 1;
                        break;
                    case InputType.END_DASH:
                        this.slide = 0;
                        break;
                    case InputType.SHOOT:
                        this.shoot(state);
                        break;
                }
            }
        }
        const friction = this.slide * SLIDE_FRICTION + (1 - this.slide) * FRICTION;
        this.xVel *= friction;
        this.yVel *= friction;
        const accel = SPEED * (1 - this.slide) * this.move;
        this.xVel += accel * Math.cos(this.rot);
        this.yVel += accel * Math.sin(this.rot);
        this.rotVel *= ROT_FRICTION;
        this.rotVel += ROT_SPEED * this.turn;
        if (this.shootProgress < 1) {
            if (this.shootProgress < SHOOT_POINT && this.shootProgress + 1 / SHOOT_TIME >= SHOOT_POINT) {
                state.bullets.add(new Bullet(this.x, this.y, BULLET_SPEED * Math.cos(this.rot), BULLET_SPEED * Math.sin(this.rot), state.time));
            }
            this.shootProgress += 1 / SHOOT_TIME;
        }
    }
    collide() {
        this.x += this.xVel;
        this.y += this.yVel;
        this.rot += this.rotVel;
    }
}
