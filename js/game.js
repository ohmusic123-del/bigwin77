const API = "https://color-game-backend1.onrender.com";
const token = localStorage.getItem("token");

let selectedAmount = null;
let roundStart = 0;

/* ===== SELECT AMOUNT ===== */
function selectAmount(amount) {
  selectedAmount = amount;
  document.querySelectorAll(".amt-btn").forEach(b => b.classList.remove("active"));
  event.target.classList.add("active");
}

/* ===== LOAD CURRENT ROUND ===== */
async function loadRound() {
  const res = await fetch(`${API}/round/current`);
  const data = await res.json();
  roundStart = data.startTime;
  document.getElementById("roundId").innerText = data.id;
}

/* ===== TIMER ===== */
setInterval(() => {
  if (!roundStart) return;
  const elapsed = Math.floor((Date.now() - roundStart) / 1000);
  const remaining = Math.max(0, 30 - elapsed);

  const timer = document.getElementById("timer");
  timer.innerText = `⏱ ${remaining}s`;

  if (remaining <= 5) timer.style.color = "red";
  else if (remaining <= 10) timer.style.color = "orange";
  else timer.style.color = "lightgreen";
}, 1000);

/* ===== PLACE BET ===== */
async function placeBet(color) {
  const msg = document.getElementById("statusMsg");

  if (!selectedAmount) {
    msg.innerText = "Select amount first";
    return;
  }

  msg.innerText = "Placing bet...";

  const res = await fetch(`${API}/bet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ color, amount: selectedAmount })
  });

  const data = await res.json();

  if (!res.ok) {
    msg.innerText = data.error || "Bet failed";
    return;
  }

  msg.innerText = "✅ Bet placed";
  loadCurrentBets();
}

/* ===== CURRENT ROUND BETS ===== */
async function loadCurrentBets() {
  const res = await fetch(`${API}/bets/current`, {
    headers: { Authorization: token }
  });
  const data = await res.json();

  const ul = document.getElementById("currentBets");
  ul.innerHTML = "";

  if (!data.bets.length) {
    ul.innerHTML = "<li>No bets this round</li>";
    return;
  }

  data.bets.forEach(b => {
    const li = document.createElement("li");
    li.innerText = `${b.color.toUpperCase()} ₹${b.amount} – ${b.status}`;
    ul.appendChild(li);
  });
}

/* ===== LAST RESULTS ===== */
async function loadHistory() {
  const res = await fetch(`${API}/rounds/history`);
  const rounds = await res.json();

  const box = document.getElementById("history");
  box.innerHTML = "";

  rounds.forEach(r => {
    const s = document.createElement("span");
    s.className = r.winner;
    s.innerText = r.winner[0].toUpperCase();
    box.appendChild(s);
  });
}

/* ===== INIT ===== */
loadRound();
loadCurrentBets();
loadHistory();

setInterval(() => {
  loadRound();
  loadCurrentBets();
  loadHistory();
}, 5000);
