const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);
export { canvas, ctx };
