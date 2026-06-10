var canvas = 0;
var context = 0;
var aspectRatioCurrentX = 0;
var aspectRatioCurrentY = 0;

function windowLoad() {
    canvas = document.createElement("canvas");
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    document.body.appendChild(canvas);
    context =
}

function windowResize() {

}

window.addEventListener("load", windowLoad);
window.addEventListener("resize", windowResize);
