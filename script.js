
let timerDisplay = document.getElementById('timer');
let scrambleDisplay = document.getElementById('scramble');
let solveHistory = document.getElementById('solveHistory');
let ao5Display = document.getElementById('ao5');
let ao12Display = document.getElementById('ao12');
let sessionAvgDisplay = document.getElementById('sessionAvg');
let bestTimeDisplay = document.getElementById('bestTime');

let times = [];
let startTime = null;
let timerInterval = null;
let isTiming = false;
let isHolding = false;
let holdStart = null;
let holdIndicator = null;

const scrambleMoves = ["R", "R'", "R2", "L", "L'", "L2", "U", "U'", "U2", "D", "D'", "D2", "F", "F'", "F2", "B", "B'", "B2"];

function generateScramble(length = 20) {
    let scramble = [];
    let lastMove = "";
    while (scramble.length < length) {
        let move = scrambleMoves[Math.floor(Math.random() * scrambleMoves.length)];
        if (move[0] !== lastMove[0]) {
            scramble.push(move);
            lastMove = move;
        }
    }
    scrambleDisplay.textContent = scramble.join(" ");
}

function formatTime(ms) {
    return (ms / 1000).toFixed(3);
}

function updateStats() {
    const sessionAvg = times.reduce((a, b) => a + b, 0) / times.length;
    sessionAvgDisplay.textContent = times.length ? formatTime(sessionAvg) : "-";

    bestTimeDisplay.textContent = times.length ? formatTime(Math.min(...times)) : "-";

    if (times.length >= 5) {
        const last5 = times.slice(-5);
        const ao5 = (last5.reduce((a, b) => a + b, 0) - Math.max(...last5) - Math.min(...last5)) / 3;
        ao5Display.textContent = formatTime(ao5);
    } else {
        ao5Display.textContent = "-";
    }

    if (times.length >= 12) {
        const last12 = times.slice(-12);
        const ao12 = (last12.reduce((a, b) => a + b, 0) - Math.max(...last12) - Math.min(...last12)) / 10;
        ao12Display.textContent = formatTime(ao12);
    } else {
        ao12Display.textContent = "-";
    }
}

function addSolve(time) {
    const listItem = document.createElement('div');
    listItem.className = 'solve-entry';
    listItem.textContent = formatTime(time);
    solveHistory.prepend(listItem);
}

function startTimer() {
    isTiming = true;
    startTime = performance.now();
    timerInterval = setInterval(() => {
        timerDisplay.textContent = formatTime(performance.now() - startTime);
    }, 10);
}

function stopTimer() {
    if (!isTiming) return;
    clearInterval(timerInterval);
    const endTime = performance.now();
    const time = endTime - startTime;
    times.push(time);
    addSolve(time);
    updateStats();
    timerDisplay.textContent = formatTime(time);
    isTiming = false;
    generateScramble();
}

function setTimerColor(color) {
    timerDisplay.style.color = color;
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !isHolding && !isTiming) {
        isHolding = true;
        holdStart = performance.now();
        setTimerColor('red');
        holdIndicator = setInterval(() => {
            const heldTime = performance.now() - holdStart;
            if (heldTime > 400 && heldTime < 800) setTimerColor('green');
            if (heldTime >= 800) setTimerColor('white');
        }, 10);
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'Space' && isHolding && !isTiming) {
        clearInterval(holdIndicator);
        const heldTime = performance.now() - holdStart;
        isHolding = false;
        if (heldTime >= 800) {
            startTimer();
        } else {
            setTimerColor('white');
        }
    } else if (e.code === 'Space' && isTiming) {
        stopTimer();
    }
});

document.getElementById('resetBtn').addEventListener('click', () => {
    times = [];
    solveHistory.innerHTML = '';
    timerDisplay.textContent = '0.000';
    ao5Display.textContent = '-';
    ao12Display.textContent = '-';
    sessionAvgDisplay.textContent = '-';
    bestTimeDisplay.textContent = '-';
    generateScramble();
});

generateScramble();
updateStats();
