const API = "https://color-game-backend1.onrender.com";
const token = localStorage.getItem("token");

if (!token) {
  location.href = "index.html";
}

/* DOM */
const walletEl = document.getElementById("walletAmount");
const roundEl = document.getElementById("roundId");
const timeEl = document.getElementById("timeLeft");
const betRedBtn = document.getElementById("betRed");
const betGreenBtn = document.getElementById("betGreen");

let timerInterval = null;

/* ======================
   LOAD WALLET
====================== */
async function loadWallet() {
  try {
    const res = await fetch(`${API}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    walletEl.innerText = `₹${data.wallet}`;
  } catch {
    walletEl.innerText = "₹0";
  }
}

/* ======================
   LOAD ROUND
====================== */
async function loadRound() {
  try {
    const res = await fetch(`${API}/round/current`);
    const data = await res.json();

    if (!data.roundId) {
      roundEl.innerText = "---";
      timeEl.innerText = "--s";
      return;
    }

    roundEl.innerText = data.roundId;
    startTimer(data.remaining ?? 30);

  } catch (e) {
    roundEl.innerText = "---";
    timeEl.innerText = "--s";
  }
}

/* ======================
   TIMER
====================== */
function startTimer(seconds) {
  clearInterval(timerInterval);
  timeEl.innerText = `${seconds}s`;

  timerInterval = setInterval(() => {
    seconds--;
    timeEl.innerText = `${seconds}s`;

    if (seconds <= 0) {
      clearInterval(timerInterval);
      setTimeout(loadRound, 1000); // fetch next round
    }
  }, 1000);
}

/* ======================
   PLACE BET
====================== */
async function placeBet(color) {
  betRedBtn.disabled = true;
  betGreenBtn.disabled = true;

  try {
    const res = await fetch(`${API}/bet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ color, amount: 10 })
    });

    const data = await res.json();
    alert(data.message || data.error);

    loadWallet();
  } catch {
    alert("Bet failed");
  }

  setTimeout(() => {
    betRedBtn.disabled = false;
    betGreenBtn.disabled = false;
  }, 1000);
}

/* ======================
   EVENTS
====================== */
betRedBtn.onclick = () => placeBet("red");
betGreenBtn.onclick = () => placeBet("green");

/* INIT */
loadWallet();
loadRound();
setInterval(loadWallet, 5000);
