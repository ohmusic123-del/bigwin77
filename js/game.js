// ================= CONFIG =================
const API_BASE = "https://YOUR_BACKEND_URL"; // 🔴 REPLACE with your backend URL
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/index.html";
}

// ================= ELEMENTS =================
const walletEl = document.getElementById("wallet");
const roundEl = document.getElementById("round");
const timeEl = document.getElementById("time");
const resultsBtn = document.getElementById("resultsBtn");
const myBetsBtn = document.getElementById("myBetsBtn");
const listEl = document.getElementById("list");

// ================= GLOBAL STATE =================
let CURRENT_ROUND_ID = null;
let TIMER_INTERVAL = null;

// ================= API HELPER =================
async function api(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      ...(options.headers || {})
    }
  });

  if (res.status === 401) {
    localStorage.clear();
    window.location.href = "/index.html";
    return;
  }

  return res.json();
}

// ================= LOAD WALLET =================
async function loadWallet() {
  try {
    const data = await api("/profile");
    walletEl.innerText = `₹${data.wallet ?? 0}`;
  } catch (e) {
    walletEl.innerText = "₹0";
  }
}

// ================= LOAD ROUND =================
async function loadRound() {
  try {
    const data = await api("/round/current");

    CURRENT_ROUND_ID = data.roundId;
    roundEl.innerText = data.roundId;

    startTimer(data.remaining);
  } catch (e) {
    roundEl.innerText = "---";
    timeEl.innerText = "--s";
  }
}

// ================= TIMER =================
function startTimer(seconds) {
  clearInterval(TIMER_INTERVAL);

  let remaining = seconds;
  timeEl.innerText = `${remaining}s`;

  TIMER_INTERVAL = setInterval(() => {
    remaining--;
    timeEl.innerText = `${remaining}s`;

    if (remaining <= 0) {
      clearInterval(TIMER_INTERVAL);
      setTimeout(loadRound, 1500);
      loadWallet();
    }
  }, 1000);
}

// ================= PLACE BET =================
async function placeBet(color) {
  if (!CURRENT_ROUND_ID) return alert("Round not ready");

  const amount = prompt("Enter bet amount");
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    return alert("Invalid amount");
  }

  const res = await api("/bet", {
    method: "POST",
    body: JSON.stringify({
      color,
      amount: Number(amount)
    })
  });

  if (res.error) {
    alert(res.error);
  } else {
    alert("Bet placed");
    loadWallet();
    loadMyBets();
  }
}

// ================= LOAD RESULTS =================
async function loadResults() {
  listEl.innerHTML = "Loading...";
  const bets = await api("/bets");

  listEl.innerHTML = bets
    .map(
      b =>
        `<div>
          ${b.roundId} | ${b.color} | ₹${b.amount} | ${b.status}
        </div>`
    )
    .join("");
}

// ================= LOAD MY BETS =================
async function loadMyBets() {
  listEl.innerHTML = "Loading...";
  const data = await api("/bets/current");

  listEl.innerHTML = data.bets.length
    ? data.bets
        .map(
          b =>
            `<div>
              ${b.roundId} | ${b.color} | ₹${b.amount} | ${b.status}
            </div>`
        )
        .join("")
    : "<div>No bets this round</div>";
}

// ================= EVENTS =================
document.getElementById("redBtn").onclick = () => placeBet("red");
document.getElementById("greenBtn").onclick = () => placeBet("green");

resultsBtn.onclick = loadResults;
myBetsBtn.onclick = loadMyBets;

// ================= INIT =================
loadWallet();
loadRound();
loadResults();
