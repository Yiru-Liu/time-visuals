const SVG_WIDTH = 512;
const SVG_HEIGHT = 512;
const SVG_RADIUS = Math.min(SVG_WIDTH / 2, SVG_HEIGHT / 2);
const LARGEU = SVG_RADIUS / 16;
const SMALLU = LARGEU / 16;
let NEG_COLOR, POS_COLOR;
if (window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches) {
    NEG_COLOR = "black";
    POS_COLOR = "white";
}
else {
    NEG_COLOR = "white";
    POS_COLOR = "black";
}
const NUM_HOURS = 24;
const HOUR_MAJOR_DIVISION = 3;
const HOUR_MARKS_INNER = 9 * LARGEU;
const MAJOR_HOUR_MARKS_OUTER = 12 * LARGEU;
const MINOR_HOUR_MARKS_OUTER = 10.75 * LARGEU;
const MAJOR_HOUR_MARKS_WIDTH = 4 * SMALLU;
const MINOR_HOUR_MARKS_WIDTH = SMALLU;
const MAJOR_HOUR_LABEL_SIZE = 2.5 * LARGEU;
const MINOR_HOUR_LABEL_SIZE = LARGEU;
const MAJOR_HOUR_LABEL_R = 14 * LARGEU;
const MINOR_HOUR_LABEL_R = 11.75 * LARGEU;
const NUM_MINUTES = 60;
const MINUTE_MAJOR_DIVISION = 5;
const MINUTE_MARKS_OUTER = 8 * LARGEU;
const MAJOR_MINUTE_MARKS_INNER = 5.5 * LARGEU;
const MINOR_MINUTE_MARKS_INNER = 6.5 * LARGEU;
const MAJOR_MINUTE_MARKS_WIDTH = 2 * SMALLU;
const MINOR_MINUTE_MARKS_WIDTH = 0.5 * SMALLU;
const MINUTE_LABEL_SIZE = 0.75 * LARGEU;
const MINUTE_LABEL_R = 4.5 * LARGEU;
const HOUR_HAND_LENGTH = 10 * LARGEU;
const HOUR_HAND_WIDTH = 10 * SMALLU;
const MINUTE_HAND_LENGTH = 7.5 * LARGEU;
const MINUTE_HAND_WIDTH = 5 * SMALLU;
const SECOND_HAND_LENGTH = 7 * LARGEU;
const SECOND_HAND_WIDTH = 2 * SMALLU;
let svgElt;
let mainElt;
let hourHand;
let minuteHand;
let secondHand;
function refreshSvg() {
    svgElt.innerHTML += "";
}
function initializeSvg() {
    mainElt.style.backgroundColor = NEG_COLOR;
    svgElt.setAttribute("viewBox", `${-SVG_WIDTH / 2} ${-SVG_HEIGHT / 2} ${SVG_WIDTH} ${SVG_HEIGHT}`);
}
function intializeClock() {
    const hourMarksLabels = [];
    for (let i = 0; i < NUM_HOURS; i++) {
        const angleDegrees = 360 / NUM_HOURS * i;
        const angleRadians = angleDegrees * Math.PI / 180;
        const mark = document.createElement("line");
        const label = document.createElement("text");
        mark.setAttribute("stroke", POS_COLOR);
        mark.setAttribute("y1", HOUR_MARKS_INNER);
        mark.setAttribute("transform", `rotate(${angleDegrees})`);
        label.appendChild(document.createTextNode(i.toString().padStart(2, "0")));
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("dominant-baseline", "central");
        label.setAttribute("fill", POS_COLOR);
        label.setAttribute("font-family", "Helvetica, sans-serif");
        label.setAttribute("style", "font-variant-numeric: tabular-nums");
        if (i % HOUR_MAJOR_DIVISION) {
            mark.setAttribute("y2", MINOR_HOUR_MARKS_OUTER);
            mark.setAttribute("stroke-width", MINOR_HOUR_MARKS_WIDTH);
            label.setAttribute("font-size", MINOR_HOUR_LABEL_SIZE);
            label.setAttribute("y", (MINOR_HOUR_LABEL_R * Math.cos(angleRadians)).toFixed(12));
            label.setAttribute("x", (MINOR_HOUR_LABEL_R * -Math.sin(angleRadians)).toFixed(12));
        }
        else {
            mark.setAttribute("y2", MAJOR_HOUR_MARKS_OUTER);
            mark.setAttribute("stroke-width", MAJOR_HOUR_MARKS_WIDTH);
            label.setAttribute("font-size", MAJOR_HOUR_LABEL_SIZE);
            label.setAttribute("y", (MAJOR_HOUR_LABEL_R * Math.cos(angleRadians)).toFixed(12));
            label.setAttribute("x", (MAJOR_HOUR_LABEL_R * -Math.sin(angleRadians)).toFixed(12));
        }
        hourMarksLabels.push(mark);
        hourMarksLabels.push(label);
    }
    const minuteMarksLabels = [];
    for (let i = 0; i < NUM_MINUTES; i++) {
        const angleDegrees = 360 / NUM_MINUTES * i;
        const angleRadians = angleDegrees * Math.PI / 180;
        const mark = document.createElement("line");
        mark.setAttribute("stroke", POS_COLOR);
        mark.setAttribute("y2", MINUTE_MARKS_OUTER);
        mark.setAttribute("transform", `rotate(${angleDegrees})`);
        if (i % MINUTE_MAJOR_DIVISION) {
            mark.setAttribute("y1", MINOR_MINUTE_MARKS_INNER);
            mark.setAttribute("stroke-width", MINOR_MINUTE_MARKS_WIDTH);
        }
        else {
            mark.setAttribute("y1", MAJOR_MINUTE_MARKS_INNER);
            mark.setAttribute("stroke-width", MAJOR_MINUTE_MARKS_WIDTH);
            const label = document.createElement("text");
            label.appendChild(document.createTextNode(i.toString().padStart(2, "0")));
            label.setAttribute("text-anchor", "middle");
            label.setAttribute("dominant-baseline", "central");
            label.setAttribute("fill", POS_COLOR);
            label.setAttribute("font-family", "Helvetica, sans-serif");
            label.setAttribute("font-size", MINUTE_LABEL_SIZE);
            label.setAttribute("style", "font-variant-numeric: tabular-nums");
            label.setAttribute("y", (MINUTE_LABEL_R * Math.cos(angleRadians)).toFixed(12));
            label.setAttribute("x", (MINUTE_LABEL_R * -Math.sin(angleRadians)).toFixed(12));
            label.setAttribute("font-weight", "bold");
            minuteMarksLabels.push(label);
        }
        minuteMarksLabels.push(mark);
    }
    hourHand = document.createElement("line");
    hourHand.id = "hour-hand";
    hourHand.setAttribute("stroke", POS_COLOR);
    hourHand.setAttribute("y2", HOUR_HAND_LENGTH);
    hourHand.setAttribute("stroke-width", HOUR_HAND_WIDTH);
    minuteHand = document.createElement("line");
    minuteHand.id = "minute-hand";
    minuteHand.setAttribute("stroke", POS_COLOR);
    minuteHand.setAttribute("y2", MINUTE_HAND_LENGTH);
    minuteHand.setAttribute("stroke-width", MINUTE_HAND_WIDTH);
    secondHand = document.createElement("line");
    secondHand.id = "second-hand";
    secondHand.setAttribute("stroke", POS_COLOR);
    secondHand.setAttribute("y2", SECOND_HAND_LENGTH);
    secondHand.setAttribute("stroke-width", SECOND_HAND_WIDTH);
    const centerPin = document.createElement("circle");
    centerPin.setAttribute("r", 6);
    centerPin.setAttribute("stroke", POS_COLOR);
    centerPin.setAttribute("stroke-width", 2 * SMALLU);
    centerPin.setAttribute("fill", NEG_COLOR);
    svgElt.append(...hourMarksLabels, ...minuteMarksLabels, hourHand, minuteHand, secondHand, centerPin);
    refreshSvg();
}
function updateSecondHand(time) {
    const secondHand = document.getElementById("second-hand");
    const angle = (time % 60_000) * 360 / 60_000;
    secondHand.setAttribute("transform", `rotate(${angle})`);
}
function updateMinuteHand(time) {
    const minuteHand = document.getElementById("minute-hand");
    const angle = (time % 3600_000) * 360 / 3600_000;
    minuteHand.setAttribute("transform", `rotate(${angle})`);
}
function updateHourHand(time) {
    const hourHand = document.getElementById("hour-hand");
    const angle = (time % 86400_000) * 360 / 86400_000;
    hourHand.setAttribute("transform", `rotate(${angle})`);
}
function updateClock() {
    const current = new Date();
    const time = current.getTime() - current.getTimezoneOffset() * 60_000;
    updateSecondHand(time);
    updateMinuteHand(time);
    updateHourHand(time);
    window.requestAnimationFrame(updateClock);
}
document.addEventListener("DOMContentLoaded", () => {
    svgElt = document.getElementById("main-svg");
    mainElt = document.getElementsByTagName("main")[0];
    initializeSvg();
    intializeClock();
    updateClock();
});
