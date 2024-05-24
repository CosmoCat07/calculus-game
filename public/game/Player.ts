import InputRecord from "./InputRecord.js"
import {
    BULLET_SPEED, COLLISION_DISTANCE,
    DASH_POW,
    FRICTION, KNOCKBACK,
    ROT_FRICTION,
    ROT_SPEED, SHOOT_FRAMES, SHOOT_POINT, SHOOT_TIME,
    SIZE, SIZE_PER_PLAYER,
    SLIDE_FRICTION,
    SPEED,
    STEP_LENGTH, WALL_FORCE
} from "./constants.js"
import InputType from "./InputType.js"
import State from "./State.js"
import Bullet from "./Bullet.js"

export default class Player {
    inputRecord: InputRecord

    turn: number
    move: number
    slide: number

    x: number
    y: number
    xVel: number
    yVel: number
    rot: number
    rotVel: number

    shootProgress: number

    hp: number
    kills: number

    name: string

    active: boolean

    constructor(
        inputs = new InputRecord(0),
        name = "", active = true,
        x = 0, y = 0,
        xVel = 0, yVel = 0,
        rot = 0,
        rotVel = 0, shootProgress = 1, turn = 0,
        move = 0, slide = 0,
        hp = 3, kills = 0
    ) {
        this.x = x
        this.y = y
        this.xVel = xVel
        this.yVel = yVel
        this.rot = rot
        this.rotVel = rotVel
        this.shootProgress = shootProgress
        this.turn = turn
        this.move = move
        this.slide = slide
        this.inputRecord = inputs
        this.hp = hp
        this.kills = kills
        this.name = name
        this.active = active
    }

    dash(){
        this.xVel = DASH_POW*Math.cos(this.rot)
        this.yVel = DASH_POW*Math.sin(this.rot)
    }

    shoot(state: State) {
        this.shootProgress = 0
    }

    update(state: State){
        if(!this.active){
            return
        }
        for(let input of this.inputRecord.inputs){
            if(state.time <= input.time && input.time < state.time + STEP_LENGTH){
                switch(input.type){
                    case InputType.FORWARD:
                        this.move = 1
                        break
                    case InputType.STOP:
                        this.move = 0
                        break
                    case InputType.LEFT:
                        this.turn = -1
                        break
                    case InputType.RIGHT:
                        this.turn = 1
                        break
                    case InputType.STRAIGHT:
                        this.turn = 0
                        break
                    case InputType.DASH:
                        this.dash()
                        this.slide = 1
                        break
                    case InputType.END_DASH:
                        this.slide = 0
                        break
                    case InputType.SHOOT:
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
                    state.time,
                    this.inputRecord.id,
                ))
            }
            this.shootProgress += 1/SHOOT_TIME
        }
    }

    collide(state: State) {
        if(!this.active){
            return
        }
        const now = state.time
        for(let bullet of state.bullets) {
            const bulletX = bullet.startX + bullet.xVel*(now - bullet.startTime)
            const bulletY = bullet.startY + bullet.yVel*(now - bullet.startTime)
            if (Math.sqrt((this.x - bulletX) ** 2 + (this.y - bulletY) ** 2) < COLLISION_DISTANCE && bullet.summonerId != this.inputRecord.id){
                this.xVel += bullet.xVel/BULLET_SPEED*KNOCKBACK
                this.yVel += bullet.yVel/BULLET_SPEED*KNOCKBACK
                this.slide = 0
                state.bullets.delete(bullet)
                this.hp --
                if(this.hp <= 0){
                    let killer
                    for(let player of state.players){
                        if(player.inputRecord.id == bullet.summonerId){
                            killer = player
                        }
                    }
                    if(killer){
                        killer.kills ++
                    }
                    this.hp = 3
                    if(state.mode == "deathmatch") {
                        this.x *= -1
                        this.y *= -1
                    }else{
                        this.active = false
                    }
                    this.xVel = 0
                    this.yVel = 0
                }
            }
        }
        const dist = Math.sqrt(this.x**2 + this.y**2)
        const xComp = this.x / dist
        const yComp = this.y / dist
        let playerCount = 0
        for(let player of state.players){
            if(player.active){
                playerCount ++
            }
        }
        const mapRadius = Math.sqrt(playerCount*SIZE_PER_PLAYER)
        if(dist > mapRadius){
            let inward = xComp * this.xVel + yComp * this.yVel
            if(inward > 0) {
                this.xVel -= inward * xComp * WALL_FORCE
                this.yVel -= inward * yComp * WALL_FORCE
            }
            this.x = xComp * mapRadius
            this.y = yComp * mapRadius
        }


        this.x += this.xVel
        this.y += this.yVel

        this.rot += this.rotVel
    }

    copy() {
        return new Player(this.inputRecord, this.name, this.active, this.x, this.y, this.xVel, this.yVel, this.rot, this.rotVel, this.shootProgress, this.turn, this.move, this.slide, this.hp, this.kills)
    }
}