let CONFIG_TYPE;
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("clockface") === "HOUR_INSIDE") {
    CONFIG_TYPE = "HOUR_INSIDE";
}
else {
    CONFIG_TYPE = "HOUR_OUTSIDE";
}
const SVG_WIDTH = 1024;
const SVG_HEIGHT = 1024;
const ROTATE_DIRECTION = Math.sign(urlParams.get("rotate")) || 1;
const SCALE_FACTOR = Number(urlParams.get("scale")) || 1;
const RENDER_RADIUS = Math.min(SVG_WIDTH / 2, SVG_HEIGHT / 2) * SCALE_FACTOR;
const LARGEU = RENDER_RADIUS / 16;
const SMALLU = LARGEU / 16;
let COLOR_SCHEME = urlParams.get("colorScheme");
if (COLOR_SCHEME !== "light" && COLOR_SCHEME !== "dark") {
    if (window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches) {
        COLOR_SCHEME = "dark";
    }
    else {
        COLOR_SCHEME = "light";
    }
}
let NEG_COLOR, POS_COLOR;
switch (COLOR_SCHEME) {
    case "light":
        NEG_COLOR = "white";
        POS_COLOR = "black";
        break;
    case "dark":
        NEG_COLOR = "black";
        POS_COLOR = "white";
}
let CLOCK_CONFIG, HANDS_CONFIG;
switch (CONFIG_TYPE) {
    case "HOUR_INSIDE":
        CLOCK_CONFIG = {
            outline: null,
            hour: {
                num: 24,
                ml: [{
                        applies: {
                            period: 3,
                            offset: 0
                        },
                        mark: {
                            range: [8.5 * LARGEU, 10.875 * LARGEU],
                            width: 3 * SMALLU
                        },
                        label: {
                            size: 2 * LARGEU,
                            r: 6.5 * LARGEU,
                            isBold: false
                        }
                    }, {
                        applies: true,
                        mark: {
                            range: [9.5 * LARGEU, 10.875 * LARGEU],
                            width: SMALLU
                        },
                        label: {
                            size: 0.875 * LARGEU,
                            r: 8.5 * LARGEU,
                            isBold: false
                        }
                    }]
            },
            minute: {
                num: 60,
                ml: [{
                        applies: {
                            period: 5,
                            offset: 0
                        },
                        mark: {
                            range: [11.5 * LARGEU, 13 * LARGEU],
                            width: 3 * SMALLU
                        },
                        label: {
                            size: 0.75 * LARGEU,
                            r: 14 * LARGEU,
                            isBold: true
                        }
                    }, {
                        applies: true,
                        mark: {
                            range: [11.5 * LARGEU, 13 * LARGEU],
                            width: 0.5 * SMALLU,
                        },
                        label: {
                            size: 0.75 * LARGEU,
                            r: 14 * LARGEU,
                            isBold: false
                        }
                    }]
            }
        };
        HANDS_CONFIG = {
            hour: {
                length: 8 * LARGEU,
                width: 10 * SMALLU,
            },
            minute: {
                length: 12.5 * LARGEU,
                width: 5 * SMALLU,
            },
            second: {
                length: 13 * LARGEU,
                width: 2 * SMALLU,
            }
        };
        break;
    case "HOUR_OUTSIDE":
        CLOCK_CONFIG = {
            outline: null,
            hour: {
                num: 24,
                ml: [{
                        applies: {
                            period: 3,
                            offset: 0
                        },
                        mark: {
                            range: [9 * LARGEU, 12 * LARGEU],
                            width: 4 * SMALLU
                        },
                        label: {
                            size: 2.5 * LARGEU,
                            r: 14 * LARGEU,
                            isBold: false
                        }
                    }, {
                        applies: true,
                        mark: {
                            range: [9 * LARGEU, 10.75 * LARGEU],
                            width: SMALLU
                        },
                        label: {
                            size: LARGEU,
                            r: 11.75 * LARGEU,
                            isBold: false
                        }
                    }]
            },
            minute: {
                num: 60,
                ml: [{
                        applies: {
                            period: 5,
                            offset: 0
                        },
                        mark: {
                            range: [5.5 * LARGEU, 8 * LARGEU],
                            width: 2 * SMALLU
                        },
                        label: {
                            size: 0.75 * LARGEU,
                            r: 4.5 * LARGEU,
                            isBold: true
                        }
                    }, {
                        applies: true,
                        mark: {
                            range: [6.5 * LARGEU, 8 * LARGEU],
                            width: 0.5 * SMALLU
                        },
                        label: null
                    }]
            }
        };
        HANDS_CONFIG = {
            hour: {
                length: 10 * LARGEU,
                width: 10 * SMALLU,
            },
            minute: {
                length: 7.5 * LARGEU,
                width: 5 * SMALLU,
            },
            second: {
                length: 7 * LARGEU,
                width: 2 * SMALLU,
            }
        };
        break;
}
function setByPath(object, path, value) {
    switch (path.length) {
        case 0:
            throw new Error("Empty path");
        case 1:
            object[path[0]] = value;
            break;
        default:
            setByPath(object[path[0]], path.slice(1), value);
    }
}
const customConfig = urlParams.get("config");
if (customConfig) {
    const configList = customConfig.split(";");
    console.log("Custom config:", configList);
    for (const kvstring of configList) {
        const kvpair = kvstring.split("=");
        console.log("kvpair:", kvpair);
        const keypath = kvpair[0].split(".");
        const value = JSON.parse(kvpair[1]);
        console.log("keypath:", keypath);
        console.log("value", value);
        setByPath(CLOCK_CONFIG, keypath, value);
    }
}
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
    defsElt.id = "defs";
    svgElt.append(defsElt);
}
function makeLabelText(coords, content, fontSize, isBold) {
    const label = document.createElement("text");
    label.appendChild(document.createTextNode(content));
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("dominant-baseline", "central");
    label.setAttribute("x", coords[0].toFixed(12));
    label.setAttribute("y", coords[1].toFixed(12));
    label.setAttribute("fill", POS_COLOR);
    label.setAttribute("font-family", "Helvetica, sans-serif");
    label.setAttribute("style", "font-variant-numeric: tabular-nums");
    label.setAttribute("font-size", fontSize);
    if (isBold) {
        label.setAttribute("font-weight", "bold");
    }
    return label;
}
function makeMark(range, width, rotation) {
    const mark = document.createElement("line");
    mark.setAttribute("stroke", POS_COLOR);
    mark.setAttribute("stroke-width", width);
    mark.setAttribute("y1", range[0]);
    mark.setAttribute("y2", range[1]);
    mark.setAttribute("transform", `rotate(${rotation})`);
    return mark;
}
function makeMarksAndLabels(subdivs) {
    const marksLabels = [];
    for (let i = 0; i < subdivs.num; i++) {
        const angleDegrees = 360 / subdivs.num * i * ROTATE_DIRECTION;
        const angleRadians = angleDegrees * Math.PI / 180;
        let mark, label;
        for (const mlconfig of subdivs.ml) {
            if (typeof mlconfig.applies === "boolean" ? mlconfig.applies :
                i % mlconfig.applies.period === mlconfig.applies.offset) {
                mark = makeMark(mlconfig.mark.range, mlconfig.mark.width, angleDegrees);
                if (mlconfig.label) {
                    label = makeLabelText([mlconfig.label.r * -Math.sin(angleRadians),
                        mlconfig.label.r * Math.cos(angleRadians)], i.toString().padStart(2, "0"), mlconfig.label.size, mlconfig.label.isBold);
                }
                else {
                    label = null;
                }
                break;
            }
        }
        if (mark === undefined || label === undefined) {
            throw new Error("No mlconfig applied");
        }
        marksLabels.push(mark);
        if (label !== null) {
            marksLabels.push(label);
        }
    }
    return marksLabels;
}
function pointedHandPoints(length, width) {
    return [
        [-width / 2, 0],
        [-width / 2, length - width],
        [0, length],
        [width / 2, length - width],
        [width / 2, 0]
    ];
}
function flatHandPoints(length, width) {
    return [
        [-width / 2, 0],
        [-width / 2, length],
        [width / 2, length],
        [width / 2, 0]
    ];
}
function toPointsString(points) {
    return points.map(p => p.join(",")).join(" ");
}
function makeHourHand() {
    const hourHandPoints = pointedHandPoints(HANDS_CONFIG.hour.length, HANDS_CONFIG.hour.width);
    const hourHand = document.createElement("polygon");
    hourHand.id = "hour-hand";
    hourHand.setAttribute("stroke", NEG_COLOR);
    hourHand.setAttribute("fill", POS_COLOR);
    hourHand.setAttribute("points", toPointsString(hourHandPoints));
    return hourHand;
}
function makeMinuteHand() {
    const minuteHandPoints = pointedHandPoints(HANDS_CONFIG.minute.length, HANDS_CONFIG.minute.width);
    const minuteHand = document.createElement("polygon");
    minuteHand.id = "minute-hand";
    minuteHand.setAttribute("stroke", NEG_COLOR);
    minuteHand.setAttribute("fill", POS_COLOR);
    minuteHand.setAttribute("points", toPointsString(minuteHandPoints));
    return minuteHand;
}
function makeSecondHand() {
    const secondHandPoints = flatHandPoints(HANDS_CONFIG.second.length, HANDS_CONFIG.second.width);
    const secondHand = document.createElement("polygon");
    secondHand.id = "second-hand";
    secondHand.setAttribute("stroke", NEG_COLOR);
    secondHand.setAttribute("fill", POS_COLOR);
    secondHand.setAttribute("points", toPointsString(secondHandPoints));
    return secondHand;
}
function makeCenterPin() {
    const centerPin = document.createElement("circle");
    centerPin.setAttribute("r", 6 * SMALLU);
    centerPin.setAttribute("stroke", POS_COLOR);
    centerPin.setAttribute("stroke-width", 2 * SMALLU);
    centerPin.setAttribute("fill", NEG_COLOR);
    return centerPin;
}
function intializeClock() {
    const hourMarksLabels = makeMarksAndLabels(CLOCK_CONFIG.hour);
    const minuteMarksLabels = makeMarksAndLabels(CLOCK_CONFIG.minute);
    const hourHand = makeHourHand();
    const minuteHand = makeMinuteHand();
    const secondHand = makeSecondHand();
    const centerPin = makeCenterPin();
    svgElt.append(...hourMarksLabels, ...minuteMarksLabels, hourHand, minuteHand, secondHand, centerPin);
    refreshSvg();
}
function updateSecondHand(time) {
    const secondHand = document.getElementById("second-hand");
    const angle = (time % 60_000) * 360 / 60_000 * ROTATE_DIRECTION;
    secondHand.setAttribute("transform", `rotate(${angle})`);
}
function updateMinuteHand(time) {
    const minuteHand = document.getElementById("minute-hand");
    const angle = (time % 3600_000) * 360 / 3600_000 * ROTATE_DIRECTION;
    minuteHand.setAttribute("transform", `rotate(${angle})`);
}
function updateHourHand(time) {
    const hourHand = document.getElementById("hour-hand");
    const angle = (time % 86400_000) * 360 / 86400_000 * ROTATE_DIRECTION;
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
