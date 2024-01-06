const SVG_WIDTH = 1024;
const SVG_HEIGHT = 1024;
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
const HOUR_M1_PERIOD = 3;
const HOUR_MARKS_OUTER = 10.875 * LARGEU;
const M1_HOUR_MARKS_INNER = 8.5 * LARGEU;
const M0_HOUR_MARKS_INNER = 9.5 * LARGEU;
const M1_HOUR_MARKS_WIDTH = 3 * SMALLU;
const M0_HOUR_MARKS_WIDTH = SMALLU;
const M1_HOUR_LABEL_SIZE = 2 * LARGEU;
const M0_HOUR_LABEL_SIZE = 0.875 * LARGEU;
const M1_HOUR_LABEL_R = 6.5 * LARGEU;
const M0_HOUR_LABEL_R = 8.5 * LARGEU;
const NUM_MINUTES = 60;
const MINUTE_MAJOR_DIVISION = 5;
const MINUTE_MARKS_INNER = 11.5 * LARGEU;
const MINUTE_MARKS_OUTER = 13 * LARGEU;
const MAJOR_MINUTE_MARKS_WIDTH = 3 * SMALLU;
const MINOR_MINUTE_MARKS_WIDTH = 0.5 * SMALLU;
const MINUTE_LABEL_SIZE = 0.75 * LARGEU;
const MINUTE_LABEL_R = 14 * LARGEU;
const HOUR_HAND_LENGTH = 8 * LARGEU;
const HOUR_HAND_WIDTH = 10 * SMALLU;
const MINUTE_HAND_LENGTH = 12 * LARGEU;
const MINUTE_HAND_WIDTH = 5 * SMALLU;
const SECOND_HAND_LENGTH = 13 * LARGEU;
const SECOND_HAND_WIDTH = 2 * SMALLU;
let svgElt;
let mainElt;
function refreshSvg() {
    svgElt.innerHTML += "";
}
function makeTriangleMarker(id, base) {
    const markerElt = document.createElement("marker");
    markerElt.id = id;
    markerElt.setAttribute("viewBox", `0 0 ${base} ${base}`);
    markerElt.setAttribute("refX", 0);
    markerElt.setAttribute("refY", base / 2);
    markerElt.setAttribute("markerWidth", 1);
    markerElt.setAttribute("markerHeight", 1);
    markerElt.setAttribute("orient", "auto");
    const pathElt = document.createElement("path");
    pathElt.setAttribute("fill", POS_COLOR);
    pathElt.setAttribute("d", `M 0 0 L ${base} ${base / 2} L 0 ${base} z`);
    markerElt.appendChild(pathElt);
    return markerElt;
}
function initializeSvg() {
    mainElt.style.backgroundColor = NEG_COLOR;
    svgElt.setAttribute("viewBox", `${-SVG_WIDTH / 2} ${-SVG_HEIGHT / 2} ${SVG_WIDTH} ${SVG_HEIGHT}`);
    const defsElt = document.createElement("defs");
    defsElt.append(makeTriangleMarker("hour-arrow", HOUR_HAND_WIDTH), makeTriangleMarker("minute-arrow", MINUTE_HAND_WIDTH));
    svgElt.append(defsElt);
}
function intializeClock() {
    const hourMarksLabels = [];
    for (let i = 0; i < NUM_HOURS; i++) {
        const angleDegrees = 360 / NUM_HOURS * i;
        const angleRadians = angleDegrees * Math.PI / 180;
        const mark = document.createElement("line");
        const label = document.createElement("text");
        mark.setAttribute("stroke", POS_COLOR);
        mark.setAttribute("y1", HOUR_MARKS_OUTER);
        mark.setAttribute("transform", `rotate(${angleDegrees})`);
        label.appendChild(document.createTextNode(i.toString().padStart(2, "0")));
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("dominant-baseline", "central");
        label.setAttribute("fill", POS_COLOR);
        label.setAttribute("font-family", "Helvetica, sans-serif");
        label.setAttribute("style", "font-variant-numeric: tabular-nums");
        if (i % HOUR_M1_PERIOD) {
            mark.setAttribute("y2", M0_HOUR_MARKS_INNER);
            mark.setAttribute("stroke-width", M0_HOUR_MARKS_WIDTH);
            label.setAttribute("font-size", M0_HOUR_LABEL_SIZE);
            label.setAttribute("y", (M0_HOUR_LABEL_R * Math.cos(angleRadians)).toFixed(12));
            label.setAttribute("x", (M0_HOUR_LABEL_R * -Math.sin(angleRadians)).toFixed(12));
        }
        else {
            mark.setAttribute("y2", M1_HOUR_MARKS_INNER);
            mark.setAttribute("stroke-width", M1_HOUR_MARKS_WIDTH);
            label.setAttribute("font-size", M1_HOUR_LABEL_SIZE);
            label.setAttribute("y", (M1_HOUR_LABEL_R * Math.cos(angleRadians)).toFixed(12));
            label.setAttribute("x", (M1_HOUR_LABEL_R * -Math.sin(angleRadians)).toFixed(12));
        }
        hourMarksLabels.push(mark);
        hourMarksLabels.push(label);
    }
    const minuteMarksLabels = [];
    for (let i = 0; i < NUM_MINUTES; i++) {
        const angleDegrees = 360 / NUM_MINUTES * i;
        const angleRadians = angleDegrees * Math.PI / 180;
        const mark = document.createElement("line");
        const label = document.createElement("text");
        mark.setAttribute("stroke", POS_COLOR);
        mark.setAttribute("y1", MINUTE_MARKS_INNER);
        mark.setAttribute("y2", MINUTE_MARKS_OUTER);
        mark.setAttribute("transform", `rotate(${angleDegrees})`);
        label.appendChild(document.createTextNode(i.toString().padStart(2, "0")));
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("dominant-baseline", "central");
        label.setAttribute("fill", POS_COLOR);
        label.setAttribute("font-family", "Helvetica, sans-serif");
        label.setAttribute("font-size", MINUTE_LABEL_SIZE);
        label.setAttribute("style", "font-variant-numeric: tabular-nums");
        label.setAttribute("y", (MINUTE_LABEL_R * Math.cos(angleRadians)).toFixed(12));
        label.setAttribute("x", (MINUTE_LABEL_R * -Math.sin(angleRadians)).toFixed(12));
        if (i % MINUTE_MAJOR_DIVISION) {
            mark.setAttribute("stroke-width", MINOR_MINUTE_MARKS_WIDTH);
        }
        else {
            mark.setAttribute("stroke-width", MAJOR_MINUTE_MARKS_WIDTH);
            label.setAttribute("font-weight", "bold");
        }
        minuteMarksLabels.push(mark);
        minuteMarksLabels.push(label);
    }
    const hourHand = document.createElement("line");
    hourHand.id = "hour-hand";
    hourHand.setAttribute("stroke", POS_COLOR);
    hourHand.setAttribute("y2", HOUR_HAND_LENGTH);
    hourHand.setAttribute("stroke-width", HOUR_HAND_WIDTH);
    hourHand.setAttribute("marker-end", "url(#hour-arrow)");
    const minuteHand = document.createElement("line");
    minuteHand.id = "minute-hand";
    minuteHand.setAttribute("stroke", POS_COLOR);
    minuteHand.setAttribute("y2", MINUTE_HAND_LENGTH);
    minuteHand.setAttribute("stroke-width", MINUTE_HAND_WIDTH);
    minuteHand.setAttribute("marker-end", "url(#minute-arrow)");
    const secondHand = document.createElement("line");
    secondHand.id = "second-hand";
    secondHand.setAttribute("stroke", POS_COLOR);
    secondHand.setAttribute("y2", SECOND_HAND_LENGTH);
    secondHand.setAttribute("stroke-width", SECOND_HAND_WIDTH);
    const centerPin = document.createElement("circle");
    centerPin.setAttribute("r", 6 * SMALLU);
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
