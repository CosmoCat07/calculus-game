import { ctx } from "./canvas.js";
import { BULLET_SIZE, SHOOT_FRAMES, SIZE } from "../game/constants.js";
import { shoot } from "./sprites.js";
export function drawState(state) {
    for (const player of state.players) {
        drawPlayer(player);
    }
    for (const bullet of state.bullets) {
        drawBullet(bullet, state.time);
    }
}
export function drawPlayer(player) {
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.rot + Math.PI / 2);
    ctx.scale(SIZE, SIZE);
    ctx.drawImage(shoot, 0, Math.floor(player.shootProgress * (SHOOT_FRAMES - 1)) / SHOOT_FRAMES * shoot.height, shoot.width, shoot.height / SHOOT_FRAMES, -shoot.width / shoot.height * SHOOT_FRAMES / 2, -1 / 2, shoot.width / shoot.height * SHOOT_FRAMES, 1);
    ctx.restore();
}
export function drawBullet(bullet, now) {
    ctx.beginPath();
    ctx.arc(bullet.startX + bullet.xVel * (now - bullet.startTime), bullet.startY + bullet.yVel * (now - bullet.startTime), BULLET_SIZE, 0, 2 * Math.PI);
    ctx.fillStyle = "brown";
    ctx.fill();
}
