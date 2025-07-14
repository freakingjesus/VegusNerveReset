const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const instructionEl = document.getElementById('instruction');
const timerEl = document.getElementById('timer');
const counterEl = document.getElementById('counter');

const durations = [4, 7, 8]; // seconds per side
const totalCycle = durations.reduce((a, b) => a + b, 0);

let lastTimestamp = null;
let startTime = null;
let elapsed = 0;

const size = 200;
const margin = 50;

const A = { x: margin, y: margin + size };
const B = { x: margin + size / 2, y: margin };
const C = { x: margin + size, y: margin + size };

function drawTriangle() {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.lineTo(C.x, C.y);
    ctx.closePath();
    ctx.stroke();
}

function drawCircle(x, y) {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
}

function pointOnEdge(p1, p2, t) {
    return {
        x: p1.x + (p2.x - p1.x) * t,
        y: p1.y + (p2.y - p1.y) * t,
    };
}

function update(timestamp) {
    if (!startTime) startTime = timestamp;
    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;
    elapsed += delta;

    const elapsedFromStart = (timestamp - startTime) / 1000;
    const totalSeconds = Math.floor(elapsedFromStart);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    let phaseTime = elapsed % totalCycle;
    let x, y;
    if (phaseTime < durations[0]) {
        const t = phaseTime / durations[0];
        ({ x, y } = pointOnEdge(A, B, t));
        instructionEl.textContent = 'Breathe in through your nose';
    } else if (phaseTime < durations[0] + durations[1]) {
        const t = (phaseTime - durations[0]) / durations[1];
        ({ x, y } = pointOnEdge(B, C, t));
        instructionEl.textContent = 'Hold';
    } else {
        const t = (phaseTime - durations[0] - durations[1]) / durations[2];
        ({ x, y } = pointOnEdge(C, A, t));
        instructionEl.textContent = 'Breathe out through your mouth';
    }

    const cycles = Math.floor(elapsed / totalCycle);
    counterEl.textContent = `Cycles: ${cycles}`;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTriangle();
    drawCircle(x, y);

    requestAnimationFrame(update);
}

requestAnimationFrame(update);
