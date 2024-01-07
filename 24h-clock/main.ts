type SvgType = HTMLElement & SVGElement;
type Coords = [x: number, y: number];
type DistRange = [r1: number, r2: number];
type MlConfig = {
  applies: (i: number) => boolean,
  range: DistRange,
  width: number,
  size: number,
  r: number,
  isBold: boolean
}
type ClockSubdivisions = {
  num: number,
  ml: MlConfig[]
}
type ClockConfig = {
  hour: ClockSubdivisions,
  minute: ClockSubdivisions
}
type HandConfig = {
  length: number,
  width: number
}
type HandsConfig = {
  hour: HandConfig,
  minute: HandConfig,
  second: HandConfig
}

const SVG_WIDTH = 1024;
const SVG_HEIGHT = 1024;

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

const CLOCK_CONFIG: ClockConfig = {
  hour: {
    num: 24,
    ml: [{
      applies: (i) => i % 3 === 0,
      range: [8.5 * LARGEU, 10.875 * LARGEU],
      width: 3 * SMALLU,
      size: 2 * LARGEU,
      r: 6.5 * LARGEU,
      isBold: false
    }, {
      applies: () => true,
      range: [9.5 * LARGEU, 10.875 * LARGEU],
      width: SMALLU,
      size: 0.875 * LARGEU,
      r: 8.5 * LARGEU,
      isBold: false
    }]
  },
  minute: {
    num: 60,
    ml: [{
      applies: (i) => i % 5 === 0,
      range: [11.5 * LARGEU, 13 * LARGEU],
      width: 3 * SMALLU,
      size: 0.75 * LARGEU,
      r: 14 * LARGEU,
      isBold: true
    }, {
      applies: () => true,
      range: [11.5 * LARGEU, 13 * LARGEU],
      width: 0.5 * SMALLU,
      size: 0.75 * LARGEU,
      r: 14 * LARGEU,
      isBold: false
    }]
  }
};

const HANDS_CONFIG: HandsConfig = {
  hour: {
    length: 8 * LARGEU,
    width: 10 * SMALLU,
  },
  minute: {
    length: 12 * LARGEU,
    width: 5 * SMALLU,
  },
  second: {
    length: 13 * LARGEU,
    width: 2 * SMALLU,
  }
};

let svgElt: SvgType;
let mainElt: HTMLDivElement;

function refreshSvg(): void {
  svgElt.innerHTML += "";
}

function makeTriangleMarker(id: string, base: number): HTMLElement {
  const markerElt = document.createElement("marker");
  markerElt.id = id;
  markerElt.setAttribute("viewBox", `0 0 ${base} ${base}`);
  markerElt.setAttribute("refX", 0 as any);
  markerElt.setAttribute("refY", base / 2 as any);
  markerElt.setAttribute("markerWidth", 1 as any);
  markerElt.setAttribute("markerHeight", 1 as any);
  markerElt.setAttribute("orient", "auto");

  const pathElt = document.createElement("path");
  pathElt.setAttribute("fill", POS_COLOR);
  pathElt.setAttribute("d", `M 0 0 L ${base} ${base / 2} L 0 ${base} z`);

  markerElt.appendChild(pathElt);
  return markerElt;
}

function initializeSvg(): void {
  mainElt.style.backgroundColor = NEG_COLOR;
  svgElt.setAttribute("viewBox",
    `${-SVG_WIDTH / 2} ${-SVG_HEIGHT / 2} ${SVG_WIDTH} ${SVG_HEIGHT}`);

  const defsElt = document.createElement("defs");
  defsElt.id = "defs";
  svgElt.append(defsElt);
}

function makeLabelText(coords: Coords, content: number,
  fontSize: number, isBold: boolean): HTMLElement {
  const label = document.createElement("text");
  label.appendChild(document.createTextNode(
    content.toString().padStart(2, "0")));
  label.setAttribute("text-anchor", "middle");
  label.setAttribute("dominant-baseline", "central");
  label.setAttribute("x", coords[0].toFixed(12) as any);
  label.setAttribute("y", coords[1].toFixed(12) as any);
  label.setAttribute("fill", POS_COLOR);
  label.setAttribute("font-family", "Helvetica, sans-serif");
  label.setAttribute("style", "font-variant-numeric: tabular-nums");
  label.setAttribute("font-size", fontSize as any);
  if (isBold) {
    label.setAttribute("font-weight", "bold");
  }
  return label;
}

function makeMark(range: DistRange, width: number,
  rotation: number): HTMLElement {
  const mark = document.createElement("line");
  mark.setAttribute("stroke", POS_COLOR);
  mark.setAttribute("stroke-width", width as any);
  mark.setAttribute("y1", range[0] as any);
  mark.setAttribute("y2", range[1] as any);
  mark.setAttribute("transform", `rotate(${rotation})`);
  return mark;
}

function makeMarksAndLabels(subdivs: ClockSubdivisions): HTMLElement[] {
  const marksLabels: HTMLElement[] = [];
  for (let i = 0; i < subdivs.num; i++) {
    const angleDegrees = 360 / subdivs.num * i;
    const angleRadians = angleDegrees * Math.PI / 180;

    let mark: HTMLElement, label: HTMLElement;
    for (const mlconfig of subdivs.ml) {
      if (mlconfig.applies(i)) {
        mark = makeMark(mlconfig.range, mlconfig.width, angleDegrees);
        label = makeLabelText(
          [mlconfig.r * -Math.sin(angleRadians),
          mlconfig.r * Math.cos(angleRadians)],
          i, mlconfig.size, mlconfig.isBold);
        break;
      }
    }

    if (mark === undefined || label === undefined) {
      throw new Error("No mlconfig applied");
    }

    marksLabels.push(mark);
    marksLabels.push(label);
  }
  return marksLabels;
}

function makeHourHand(): HTMLElement {
  const defsElt = document.getElementById("defs");
  defsElt.appendChild(
    makeTriangleMarker("hour-arrow", HANDS_CONFIG.hour.width));
  const hourHand = document.createElement("line");
  hourHand.id = "hour-hand";
  hourHand.setAttribute("stroke", POS_COLOR);
  hourHand.setAttribute("y2", HANDS_CONFIG.hour.length as any);
  hourHand.setAttribute("stroke-width", HANDS_CONFIG.hour.width as any);
  hourHand.setAttribute("marker-end", "url(#hour-arrow)");
  return hourHand;
}

function makeMinuteHand(): HTMLElement {
  const defsElt = document.getElementById("defs");
  defsElt.appendChild(
    makeTriangleMarker("minute-arrow", HANDS_CONFIG.minute.width));
  const minuteHand = document.createElement("line");
  minuteHand.id = "minute-hand";
  minuteHand.setAttribute("stroke", POS_COLOR);
  minuteHand.setAttribute("y2", HANDS_CONFIG.minute.length as any);
  minuteHand.setAttribute("stroke-width", HANDS_CONFIG.minute.width as any);
  minuteHand.setAttribute("marker-end", "url(#minute-arrow)");
  return minuteHand;
}

function makeSecondHand(): HTMLElement {
  const secondHand = document.createElement("line");
  secondHand.id = "second-hand";
  secondHand.setAttribute("stroke", POS_COLOR);
  secondHand.setAttribute("y2", HANDS_CONFIG.second.length as any);
  secondHand.setAttribute("stroke-width", HANDS_CONFIG.second.width as any);
  return secondHand;
}

function makeCenterPin(): HTMLElement {
  const centerPin = document.createElement("circle");
  centerPin.setAttribute("r", 6 * SMALLU as any);
  centerPin.setAttribute("stroke", POS_COLOR);
  centerPin.setAttribute("stroke-width", 2 * SMALLU as any);
  centerPin.setAttribute("fill", NEG_COLOR);
  return centerPin;
}

function intializeClock(): void {
  const hourMarksLabels = makeMarksAndLabels(CLOCK_CONFIG.hour);
  const minuteMarksLabels = makeMarksAndLabels(CLOCK_CONFIG.minute);

  const hourHand = makeHourHand();
  const minuteHand = makeMinuteHand();
  const secondHand = makeSecondHand();

  const centerPin = makeCenterPin();

  svgElt.append(...hourMarksLabels, ...minuteMarksLabels,
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
  const angle = (time % 86400_000) * 360 / 86400_000;
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
  svgElt = document.getElementById("main-svg") as SvgType;
  mainElt = document.getElementsByTagName("main")[0] as HTMLDivElement;
  initializeSvg();
  intializeClock();
  updateClock();
});
