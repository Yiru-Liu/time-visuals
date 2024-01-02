const SVG_WIDTH = 512;
const SVG_HEIGHT = 512;

const SVG_RADIUS = Math.min(SVG_WIDTH / 2, SVG_HEIGHT / 2);
const LARGEU = SVG_RADIUS / 16;
const SMALLU = LARGEU / 16;

let NEG_COLOR: string
  , POS_COLOR: string;
if (window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches) {
  NEG_COLOR = "black";
  POS_COLOR = "white";
} else {
  NEG_COLOR = "white";
  POS_COLOR = "black";
}

type svgType = HTMLElement & SVGElement;

let svgElt: svgType;
let mainElt: HTMLDivElement;

function refreshSvg(): void {
  svgElt.innerHTML += "";
}

function initializeSvg(): void {
  mainElt.style.backgroundColor = NEG_COLOR;
  svgElt.setAttribute("viewBox",
    `${-SVG_WIDTH / 2} ${-SVG_HEIGHT / 2} ${SVG_WIDTH} ${SVG_HEIGHT}`);
}

function intializeClock(): void {
  // const outerCircle = document.createElement("circle");
  // outerCircle.setAttribute("r", SVG_RADIUS as any);
  // outerCircle.setAttribute("fill", POS_COLOR);

  // const innerCircle = document.createElement("circle");
  // innerCircle.setAttribute("r", SVG_RADIUS * 15.5 / 16 as any);
  // innerCircle.setAttribute("fill", NEG_COLOR);

  const tickMarks = [];
  for (let i = 0; i < 60; i++) {
    const mark = document.createElement("line");
    mark.setAttribute("stroke", POS_COLOR);
    if (i % 5) {
      mark.setAttribute("y1", -11.5 * LARGEU as any);
      mark.setAttribute("y2", -13 * LARGEU as any);
      mark.setAttribute("stroke-width", SMALLU as any);
    } else {
      mark.setAttribute("y1", -10.5 * LARGEU as any);
      mark.setAttribute("y2", -13 * LARGEU as any);
      mark.setAttribute("stroke-width", 3 * SMALLU as any);
    }

    mark.setAttribute("transform", `rotate(${6 * i})`);
    tickMarks.push(mark);
  }

  const hourLabels = [];
  for (let i = 1; i <= 12; i++) {
    const l = document.createElement("text");
    l.appendChild(document.createTextNode(i.toString().padStart(2, "0")));
    l.setAttribute("text-anchor", "middle");
    l.setAttribute("dominant-baseline", "central");
    l.setAttribute("fill", POS_COLOR);
    l.setAttribute("font-family",
      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif");
    l.setAttribute("font-size", 2 * LARGEU as any);
    l.setAttribute("style", "font-variant-numeric: tabular-nums");

    l.setAttribute("y",
      (-8.625 * Math.cos(i * Math.PI / 6) * LARGEU).toFixed(12));
    l.setAttribute("x",
      (8.625 * Math.sin(i * Math.PI / 6) * LARGEU).toFixed(12));

    hourLabels.push(l);
  }

  const minuteLabels = [];
  for (let i = 0; i < 60; i++) {
    const l = document.createElement("text");
    l.appendChild(document.createTextNode(i.toString().padStart(2, "0")));
    l.setAttribute("text-anchor", "middle");
    l.setAttribute("dominant-baseline", "central");
    l.setAttribute("fill", POS_COLOR);
    l.setAttribute("font-family",
      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif");
    l.setAttribute("font-size", 0.75 * LARGEU as any);
    l.setAttribute("style", "font-variant-numeric: tabular-nums");
    if (!(i % 5)) {
      l.setAttribute("font-weight", "bold");
    }

    l.setAttribute("y",
      (-14 * Math.cos(i * Math.PI / 30) * LARGEU).toFixed(12));
    l.setAttribute("x",
      (14 * Math.sin(i * Math.PI / 30) * LARGEU).toFixed(12));

    minuteLabels.push(l);
  }

  const hourHand = document.createElement("line");
  hourHand.id = "hour-hand";
  hourHand.setAttribute("stroke", POS_COLOR);
  hourHand.setAttribute("y2", -5 * LARGEU as any);
  hourHand.setAttribute("stroke-width", 10 * SMALLU as any);

  const minuteHand = document.createElement("line");
  minuteHand.id = "minute-hand";
  minuteHand.setAttribute("stroke", POS_COLOR);
  minuteHand.setAttribute("y2", -12 * LARGEU as any);
  minuteHand.setAttribute("stroke-width", 5 * SMALLU as any);

  const secondHand = document.createElement("line");
  secondHand.id = "second-hand";
  secondHand.setAttribute("stroke", POS_COLOR);
  secondHand.setAttribute("y2", -13 * LARGEU as any);
  secondHand.setAttribute("stroke-width", 2 * SMALLU as any);

  const centerPin = document.createElement("circle");
  centerPin.setAttribute("r", 6 as any);
  centerPin.setAttribute("stroke", POS_COLOR);
  centerPin.setAttribute("stroke-width", 2 * SMALLU as any);
  centerPin.setAttribute("fill", NEG_COLOR);

  svgElt.append(...tickMarks, ...hourLabels, ...minuteLabels,
    hourHand, minuteHand, secondHand, centerPin);
  refreshSvg();
}

function updateSecondHand(time: number): void {
  const secondHand = document.getElementById("second-hand");
  const angle = (time % 60_000) * 360 / 60_000;
  secondHand.setAttribute("transform", `rotate(${angle})`);
}

function updateMinuteHand(time: number): void {
  const minuteHand = document.getElementById("minute-hand");
  const angle = (time % 3600_000) * 360 / 3600_000;
  minuteHand.setAttribute("transform", `rotate(${angle})`);
}

function updateHourHand(time: number): void {
  const hourHand = document.getElementById("hour-hand");
  const angle = (time % 43_200_000) * 360 / 43_200_000;
  hourHand.setAttribute("transform", `rotate(${angle})`);
}

function updateClock(): void {
  const current = new Date();
  const time = current.getTime() - current.getTimezoneOffset() * 60_000;
  updateSecondHand(time);
  updateMinuteHand(time);
  updateHourHand(time);
  window.requestAnimationFrame(updateClock);
}

document.addEventListener("DOMContentLoaded", () => {
  svgElt = document.getElementById("main-svg") as svgType;
  mainElt = document.getElementsByTagName("main")[0] as HTMLDivElement;
  initializeSvg();
  intializeClock();
  updateClock();
});
