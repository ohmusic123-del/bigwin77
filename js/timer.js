/* =========================
   TIMER STATE
========================= */
let timerInterval = null;
let timeLeft = 0;
let currentRoundId = null;

/* =========================
   ELEMENTS
========================= */
const roundIdEl = document.getElementById("roundId");
const timeLeftEl = document.getElementById("timeLeft");

/* =========================
   FETCH CURRENT ROUND
========================= */
async function loadCurrentRound() {
  try {
    const res = await fetch(`${API}/round/current`);
    const data = await res.json();

    if (!res.ok) return;

    currentRoundId = data.roundId;
    timeLeft = data.timeLeft;

    roundIdEl.textContent = currentRoundId;
    updateTimerUI();

    startTimer();
  } catch (err) {
    console.log("Round fetch error");
  }
}

/* =========================
   START TIMER
========================= */
function startTimer() {
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    timeLeft--;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeLeft = 0;
      updateTimerUI();

      // reload everything on round end
      setTimeout(() => {
        loadCurrentRound();
        if (typeof loadResults === "function") loadResults();
        if (typeof loadMyBets === "function") loadMyBets();
      }, 1000);
      return;
    }

    updateTimerUI();
  }, 1000);
}

/* =========================
   UPDATE UI
========================= */
function updateTimerUI() {
  timeLeftEl.textContent = `${timeLeft}s`;

  // Optional: lock betting in last 5 seconds
  if (timeLeft <= 5) {
    document.body.classList.add("bet-locked");
  } else {
    document.body.classList.remove("bet-locked");
  }
}

/* =========================
   AUTO INIT
========================= */
loadCurrentRound();
