import { canvas, ctx } from "./canvas.js";
import { BULLET_SIZE, INFO_HEIGHT, NAME_HEIGHT, SHOOT_FRAMES, SIZE, SIZE_PER_PLAYER } from "../game/constants.js";
import { shoot } from "./sprites.js";
export function drawState(state, camera) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.translate(-camera.x, -camera.y);
    ctx.beginPath();
    ctx.arc(0, 0, Math.sqrt(state.players.size * SIZE_PER_PLAYER), 0, 2 * Math.PI);
    ctx.fillStyle = "bisque";
    ctx.fill();
    for (const player of state.players) {
        drawPlayer(player);
    }
    for (const bullet of state.bullets) {
        drawBullet(bullet, state.time);
    }
    ctx.restore();
}
export function drawPlayer(player) {
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.rot + Math.PI / 2);
    ctx.scale(SIZE, SIZE);
    ctx.drawImage(shoot, 0, Math.floor(player.shootProgress * (SHOOT_FRAMES - 1)) / SHOOT_FRAMES * shoot.height + 3, shoot.width, shoot.height / SHOOT_FRAMES, -shoot.width / shoot.height * SHOOT_FRAMES / 2, -1 / 2, shoot.width / shoot.height * SHOOT_FRAMES, 1);
    ctx.restore();
    ctx.fillStyle = "brown";
    ctx.textAlign = "center";
    ctx.font = "bold 20px serif";
    ctx.fillText(`${player.name}`, player.x, player.y - NAME_HEIGHT);
    ctx.font = "bold 10px serif";
    ctx.fillText(`Hp: ${player.hp} Kills: ${player.kills}`, player.x, player.y - INFO_HEIGHT);
}
export function drawBullet(bullet, now) {
    ctx.beginPath();
    ctx.arc(bullet.startX + bullet.xVel * (now - bullet.startTime), bullet.startY + bullet.yVel * (now - bullet.startTime), BULLET_SIZE, 0, 2 * Math.PI);
    ctx.fillStyle = "brown";
    ctx.fill();
}
