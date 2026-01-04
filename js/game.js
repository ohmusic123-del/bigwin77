const API = "https://color-game-backend1.onrender.com";

let selectedColor = null;
let selectedAmount = 0;
let roundId = null;
let timerInterval = null;

/* =========================
   INIT
========================= */

init();

async function init() {
  await loadRound();
}

/* =========================
   ROUND
========================= */

async function loadRound() {
  const res = await fetch(`${API}/round/current`);
  const data = await res.json();

  roundId = data.id;
  document.getElementById("roundId").innerText = `Round ID: ${roundId}`;

  startTimer(data.startTime);
}

function startTimer(startTime) {
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = 30 - elapsed;

    document.getElementById("timer").innerText = remaining > 0 ? remaining : 0;

    if (remaining <= 0) {
      clearInterval(timerInterval);
      lockBetting();
      resolveRound();
    }
  }, 1000);
}

/* =========================
   BET UI
========================= */

function selectColor(color) {
  selectedColor = color;
  document.getElementById("status").innerText =
    `Selected: ${color.toUpperCase()}`;
}

function selectAmount(amount) {
  selectedAmount = amount;
  document.getElementById("status").innerText =
    `Bet ₹${amount} on ${selectedColor?.toUpperCase() || "?"}`;
}

/* =========================
   PLACE BET
========================= */

async function placeBet() {
  if (!selectedColor || !selectedAmount) {
    alert("Select color & amount");
    return;
  }

  const res = await fetch(`${API}/bet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    },
    body: JSON.stringify({
      color: selectedColor,
      amount: selectedAmount
    })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Bet failed");
    return;
  }

  document.getElementById("status").innerText = "Bet placed ✅";
}

/* =========================
   ROUND END
========================= */

function lockBetting() {
  document.getElementById("status").innerText = "Betting closed ⛔";
}

async function resolveRound() {
  const res = await fetch(`${API}/round/resolve`, { method: "POST" });
  const data = await res.json();

  document.getElementById("status").innerText =
    `Winner: ${data.winner.toUpperCase()} 🎉`;

  setTimeout(loadRound, 5000);
}
