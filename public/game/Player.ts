import InputRecord, {SerializedInputRecord} from "./InputRecord.js"
import {
    BULLET_SPEED,
    DASH_POW,
    FRICTION,
    ROT_FRICTION,
    ROT_SPEED, SHOOT_FRAMES, SHOOT_POINT, SHOOT_TIME,
    SIZE,
    SLIDE_FRICTION,
    SPEED,
    STEP_LENGTH
} from "./constants.js"
import InputTypes from "./InputTypes.js"
import {ctx} from "../client/canvas.js"
import {death, shoot} from "../client/sprites.js"
import State from "./State.js"
import Bullet from "./Bullet.js"

export default class Player {
    inputs: InputRecord

    turn = 0
    move = 0
    slide = 0

    x: number
    y: number
    xVel: number
    yVel: number
    rot = 0
    rotVel = 0

    shootProgress = 0


    constructor(x: number, y: number, xVel: number, yVel: number, inputs: InputRecord) {
        this.x = x
        this.y = y
        this.xVel = xVel
        this.yVel = yVel
        this.inputs = inputs
    }

    dash(){
        this.xVel = DASH_POW*Math.cos(this.rot)
        this.yVel = DASH_POW*Math.sin(this.rot)
    }

    shoot(state: State) {
        this.shootProgress = 0
        // this.xVel -= 2*Math.cos(this.rot)
        // this.yVel -= 2*Math.sin(this.rot)
    }

    update(state: State){
        for(let input of this.inputs.inputs){
            if(state.time <= input.time && input.time < state.time + STEP_LENGTH){
                switch(input.type){
                    case InputTypes.FORWARD:
                        this.move = 1
                        break
                    case InputTypes.STOP:
                        this.move = 0
                        break
                    case InputTypes.LEFT:
                        this.turn = -1
                        break
                    case InputTypes.RIGHT:
                        this.turn = 1
                        break
                    case InputTypes.STRAIGHT:
                        this.turn = 0
                        break
                    case InputTypes.DASH:
                        this.dash()
                        this.slide = 1
                        break
                    case InputTypes.END_DASH:
                        this.slide = 0
                        break
                    case InputTypes.SHOOT:
                        this.shoot(state)
                        break
                }
            }
        }


        const friction = this.slide*SLIDE_FRICTION + (1 - this.slide)*FRICTION
        this.xVel *= friction
        this.yVel *= friction
        const accel = SPEED*(1 - this.slide)*this.move
        this.xVel += accel*Math.cos(this.rot)
        this.yVel += accel*Math.sin(this.rot)

        this.rotVel *= ROT_FRICTION
        this.rotVel += ROT_SPEED*this.turn

        if(this.shootProgress < 1){
            if(this.shootProgress < SHOOT_POINT && this.shootProgress + 1/SHOOT_TIME >= SHOOT_POINT){
                state.bullets.add(new Bullet(
                    this.x, this.y,
                    BULLET_SPEED*Math.cos(this.rot), BULLET_SPEED*Math.sin(this.rot),
                    state.time
                ))
            }
            this.shootProgress += 1/SHOOT_TIME
        }
    }

    collide() {
        this.x += this.xVel
        this.y += this.yVel

        this.rot += this.rotVel
    }

    serialize(): SerializedPlayer {
        return {
            x: this.x,
            y: this.y,
            xVel: this.xVel,
            yVel: this.yVel,
            rot: this.rot,
            rotVel: this.rotVel,
            shootProgress: this.shootProgress,
            turn: this.turn,
            move: this.move,
            slide: this.slide,
            inputs: this.inputs.serialize()
        }
    }
}

export type SerializedPlayer = {
    x: number,
    y: number,
    xVel: number,
    yVel: number,
    rot: number,
    rotVel: number,
    shootProgress: number,
    turn: number,
    move: number,
    slide: number,
    inputs: SerializedInputRecord,
}