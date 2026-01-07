const API = "https://color-game-backend1.onrender.com";
const token = localStorage.getItem("token");

let CURRENT_ROUND = null;

/* ======================
   LOAD CURRENT ROUND
====================== */
async function loadRound() {
  const res = await fetch(`${API}/round/current`);
  CURRENT_ROUND = await res.json();

  document.getElementById("roundId").innerText = CURRENT_ROUND.id;
}

/* ======================
   TIMER
====================== */
setInterval(() => {
  if (!CURRENT_ROUND) return;

  const elapsed = Math.floor(
    (Date.now() - CURRENT_ROUND.startTime) / 1000
  );

  const remaining = Math.max(0, 30 - elapsed);
  document.getElementById("timer").innerText = remaining;

  if (remaining === 0) {
    disableBets();

    // reload after result
    setTimeout(() => {
      loadRound();
      loadHistory();
      loadMyBets();
      enableBets();
    }, 1500);
  }
}, 1000);

/* ======================
   BET BUTTON CONTROL
====================== */
function disableBets() {
  document.querySelectorAll(".bet-btn")
    .forEach(b => b.disabled = true);
}

function enableBets() {
  document.querySelectorAll(".bet-btn")
    .forEach(b => b.disabled = false);
}

/* ======================
   PLACE BET
====================== */
async function placeBet(color) {
  const amount = Number(prompt("Enter bet amount"));

  if (!amount || amount <= 0) return;

  const res = await fetch(`${API}/bet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ color, amount })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Bet failed");
    return;
  }

  loadMyBets();
}

/* ======================
   LOAD USER CURRENT BETS
====================== */
async function loadMyBets() {
  const res = await fetch(`${API}/bets/current`, {
    headers: { Authorization: token }
  });

  const data = await res.json();
  const div = document.getElementById("myBets");

  if (!data.bets.length) {
    div.innerText = "No bets";
    return;
  }

  div.innerHTML = "";
  data.bets.forEach(b => {
    div.innerHTML += `
      <div>${b.color.toUpperCase()} ₹${b.amount} (${b.status})</div>
    `;
  });
}

/* ======================
   LOAD ROUND HISTORY
====================== */
async function loadHistory() {
  const res = await fetch(`${API}/rounds/history`);
  const rounds = await res.json();

  const ul = document.getElementById("history");
  ul.innerHTML = "";

  rounds.forEach(r => {
    const li = document.createElement("li");
    li.innerText = `${r.roundId} → ${r.winner.toUpperCase()}`;
    ul.appendChild(li);
  });
}

/* ======================
   INIT
====================== */
loadRound();
loadHistory();
loadMyBets();

setInterval(loadMyBets, 2000);
