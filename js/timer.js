/* =========================
   CONFIG
========================= */
const roundIdEl = document.getElementById("roundId");
const timerEl = document.getElementById("timer");

/* =========================
   STATE
========================= */
let roundStartTime = 0;
let roundId = "";

/* =========================
   FETCH CURRENT ROUND
========================= */
async function loadCurrentRound() {
  try {
    const res = await fetch(API + "/round/current");
    const data = await res.json();

    roundId = data.id;
    roundStartTime = data.startTime;

    if (roundIdEl) {
      roundIdEl.innerText = roundId;
    }
  } catch (err) {
    console.error("Failed to load round");
  }
}

/* =========================
   TIMER LOOP
========================= */
function startTimer() {
  setInterval(() => {
    if (!roundStartTime) return;

    const elapsed = Math.floor((Date.now() - roundStartTime) / 1000);
    let remaining = 30 - elapsed;

    if (remaining < 0) remaining = 0;

    if (timerEl) {
      timerEl.innerText = remaining + "s";
    }

    // 🔁 When round ends → reload round
    if (remaining === 0) {
      loadCurrentRound();
    }
  }, 1000);
}

/* =========================
   INIT
========================= */
loadCurrentRound();
startTimer();
