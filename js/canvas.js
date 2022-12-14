import {
  noise,
  noiseSeed,
} from "../../node_modules/@chriscourses/perlin-noise/index.js";
import { randomIntFromRange, randomColor } from "./utils.js";
import Vector from "./Vector.js";
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

// **Global Variables** \
let num = 500;
let scaleNoise = 0.01;
let angleMult = 1;
let colors = ["yellow", "blue"];
let acc = 3;
let backgroundColor = "#222";
let globalAlpha = 0.1;

// **Controls** \

// Elements
const body = document.querySelector("body");
const h1 = document.querySelector("h1");
const scaleNoiseIncrement = document.getElementsByClassName("increment")[0];
const scaleNoiseDecrement = document.getElementsByClassName("decrement")[0];
const particalesAmountRange = document.getElementById("particales");
const angleMulttRange = document.getElementById("noise-angle");
const accelerationRange = document.getElementById("acceleration");
const colorPicker = document.getElementById("color-picker");
const resetColors = document.getElementById("reset-color-btn");
const backgroundColorPicker = document.getElementById(
  "background-color-picker"
);
const resetBackground = document.getElementById("reset-background-btn");
const controls = document.getElementById("controls-container");
const showControls = document.getElementById("show-controls");
const closeControls = document.getElementById("close-btn");
const fullAlpha = document.getElementById("full-alpha-check");
const fullScreen = document.getElementById("full-screen-btn");
const closeFullScreen = document.getElementById("close-full-screen");

// Display Elements
const scaleNoiseDisplay = document.getElementById("noise-scale");
const particalesAmountDisplay = document.getElementById("particales-num");
const angleMultDisplay = document.getElementById("angle-num");
const accelerationDisplay = document.getElementById("acc-num");

// Controls Display Set Up
h1.style.color = colors[0];
scaleNoiseDisplay.innerHTML = scaleNoise;
particalesAmountDisplay.innerHTML = num;
accelerationDisplay.innerHTML = acc;
angleMultDisplay.innerHTML = angleMult;

// Controls Values Set Up
particalesAmountRange.value = num;
angleMulttRange.value = angleMult;
accelerationRange.value = acc;

// Controls Event Listeners
scaleNoiseIncrement.addEventListener("click", () => {
  if (scaleNoise !== 0.1) {
    c.clearRect(0, 0, canvas.width, canvas.height);
    init();
    scaleNoise *= 10;
    scaleNoiseDisplay.innerHTML = scaleNoise;
  }
});

scaleNoiseDecrement.addEventListener("click", () => {
  if (scaleNoise !== 0.00001) {
    c.clearRect(0, 0, canvas.width, canvas.height);
    init();
    scaleNoise /= 10;
    scaleNoiseDisplay.innerHTML = scaleNoise;
  }
});

particalesAmountRange.addEventListener("change", () => {
  c.clearRect(0, 0, canvas.width, canvas.height);
  num = particalesAmountRange.value;
  particalesAmountDisplay.innerHTML = num;
  init();
});

angleMulttRange.addEventListener("change", () => {
  c.clearRect(0, 0, canvas.width, canvas.height);
  angleMult = angleMulttRange.value;
  angleMultDisplay.innerHTML = angleMult;
  init();
});

accelerationRange.addEventListener("change", () => {
  c.clearRect(0, 0, canvas.width, canvas.height);
  acc = accelerationRange.value;
  accelerationDisplay.innerHTML = acc;
  init();
});

colorPicker.addEventListener("change", () => {
  c.clearRect(0, 0, canvas.width, canvas.height);
  colors = [colorPicker.value];
  h1.style.color = colors[0];
  init();
});

resetColors.addEventListener("click", () => {
  c.clearRect(0, 0, canvas.width, canvas.height);
  colors = ["yellow", "blue"];
  h1.style.color = colors[0];
  init();
});

backgroundColorPicker.addEventListener("change", () => {
  c.clearRect(0, 0, canvas.width, canvas.height);
  body.style.backgroundColor = backgroundColorPicker.value;
  backgroundColor = backgroundColorPicker.value;
  init();
});

fullAlpha.addEventListener("change", () => {
  c.clearRect(0, 0, canvas.width, canvas.height);
  fullAlpha.checked
    ? ((globalAlpha = 1),
      (acc = 1),
      (accelerationDisplay.innerHTML = acc),
      (accelerationRange.value = acc))
    : ((globalAlpha = 0.1),
      (acc = 3),
      (accelerationDisplay.innerHTML = acc),
      (accelerationRange.value = acc));
  init();
});

resetBackground.addEventListener("click", () => {
  c.clearRect(0, 0, canvas.width, canvas.height);
  body.style.backgroundColor = "#222";
  backgroundColor = "#222";
  init();
});

showControls.addEventListener("click", () => {
  controls.style.display = "flex";
});

closeControls.addEventListener("click", () => {
  controls.style.display = "none";
});

fullScreen.addEventListener("click", () => {
  c.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  closeFullScreen.style.display = "flex";
  init();
});

closeFullScreen.addEventListener("click", () => {
  c.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = window.innerWidth * 0.75;
  canvas.height = window.innerHeight * 0.75;
  closeFullScreen.style.display = "none";
  init();
});

// **Canvas Resize** \

canvas.width = window.innerWidth * 0.75;
canvas.height = window.innerHeight * 0.75;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth * 0.75;
  canvas.height = window.innerHeight * 0.75;

  init();
});

canvas.addEventListener("click", () => {
  c.clearRect(0, 0, canvas.width, canvas.height);

  init();

  let milli = new Date().getMilliseconds();
  noiseSeed(milli);
});

// **Objects** \

// Particales

let particales = [];
class Particale {
  constructor(x, y, color) {
    this.pos = new Vector(x, y);
    this.prevPos = this.pos.copy();
    this.color = color;
  }

  draw() {
    c.save();
    c.beginPath();

    // c.arc(this.pos.x, this.pos.y, 0.5, 0, Math.PI * 2, false);
    // c.fillStyle = this.color;
    // c.fill();

    c.moveTo(this.prevPos.x, this.prevPos.y);
    c.lineTo(this.pos.x, this.pos.y);
    c.strokeStyle = this.color;
    c.stroke();

    c.closePath();
    c.restore();
    this.updatePrev();
  }

  // Keep track of pervious position of the Particale
  updatePrev() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  // Keep Particales on Screen
  edges() {
    if (this.pos.x > canvas.width) {
      this.pos.x = 0;
      this.updatePrev();
    }
    if (this.pos.x < 0) {
      this.pos.x = canvas.width;
      this.updatePrev();
    }
    if (this.pos.y > canvas.height) {
      this.pos.y = 0;
      this.updatePrev();
    }
    if (this.pos.y < 0) {
      this.pos.y = canvas.height;
      this.updatePrev();
    }
  }
}

// **Init Function** \
function init() {
  particales = [];
  c.fillStyle = backgroundColor;
  c.globalAlpha = globalAlpha;
  c.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < num; i++) {
    particales.push(
      new Particale(
        randomIntFromRange(0, canvas.width),
        randomIntFromRange(0, canvas.height),
        randomColor(colors)
      )
    );
  }
}

// **Animation Loop** \
function animate() {
  requestAnimationFrame(animate);

  // c.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particales.length; i++) {
    particales[i].edges();
    particales[i].draw();

    let n = noise(
      particales[i].pos.x * scaleNoise,
      particales[i].pos.y * scaleNoise
    );

    let a = Math.PI * 2 * n * angleMult;
    particales[i].pos.x += Math.cos(a) * acc;
    particales[i].pos.y += Math.sin(a) * acc;
  }
}

init();
animate();
