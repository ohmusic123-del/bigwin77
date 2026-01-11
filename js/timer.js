// ==========================
// TIMER STATE
// ==========================
let roundEndTime = 0;
let timerInterval = null;

// ==========================
// DOM
// ==========================
const timerText = document.getElementById("timerText");
const placeBetBtn = document.getElementById("placeBetBtn");

// ==========================
// FETCH CURRENT ROUND
// ==========================
async function syncRound() {
  try {
    const res = await fetch(`${API}/round/current`);
    const data = await res.json();

    if (!data || !data.startTime) return;

    // Round is 30 seconds long
    roundEndTime = data.startTime + 30 * 1000;

    startTimer();
  } catch (err) {
    console.error("Round sync failed");
  }
}

// ==========================
// START TIMER
// ==========================
function startTimer() {
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    const now = Date.now();
    let remaining = Math.floor((roundEndTime - now) / 1000);

    if (remaining <= 0) {
      remaining = 0;
      lockBetting();
    } else {
      unlockBetting();
    }

    timerText.innerText = `00:${remaining < 10 ? "0" + remaining : remaining}`;

  }, 1000);
}

// ==========================
// LOCK / UNLOCK BET
// ==========================
function lockBetting() {
  placeBetBtn.classList.add("disabled");
  placeBetBtn.innerText = "Bet Closed";
}

function unlockBetting() {
  placeBetBtn.classList.remove("disabled");
  placeBetBtn.innerText = "Place Bet";
}

// ==========================
// AUTO RE-SYNC EVERY ROUND
// ==========================
setInterval(syncRound, 5000);

// ==========================
// INIT
// ==========================
syncRound();
