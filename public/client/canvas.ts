const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

function resize(){
    canvas.width = innerWidth
    canvas.height = innerHeight
}
resize()
addEventListener("resize", resize)

export {canvas, ctx}