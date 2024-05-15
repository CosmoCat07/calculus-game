import Player from "./Player.js"
import {clientInputRecord} from "./clientInputRecord.js"
import State from "./State.js"
import Bullet from "./Bullet.js"
import {setCurrentState} from "./currentState.js"
import gameLoop from "./gameLoop.js"

const clientPlayer = new Player(0, 0, 0, 0, clientInputRecord)

const players = new Set<Player>
players.add(clientPlayer)

const state = new State(new Date().getTime(), players, new Set<Bullet>)
setCurrentState(state)

gameLoop()