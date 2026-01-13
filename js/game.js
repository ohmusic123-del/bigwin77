let selectedColor = null;
let betAmount = 0;

const walletBalance = document.getElementById("walletBalance");
const roundIdEl = document.getElementById("roundId");

const redBtn = document.getElementById("redBtn");
const greenBtn = document.getElementById("greenBtn");

const betSection = document.getElementById("betSection");
const betAmountEl = document.getElementById("betAmount");
const placeBetBtn = document.getElementById("placeBetBtn");
const plusBtn = document.getElementById("plusBtn");

const amountBtns = document.querySelectorAll(".amount-btn");

const resultsTab = document.getElementById("resultsTab");
const myBetsTab = document.getElementById("myBetsTab");
const resultsList = document.getElementById("resultsList");
const myBetsList = document.getElementById("myBetsList");

const token = localStorage.getItem("token");

if (!token) location.href = "index.html";

/* ======================
   COLOR SELECTION
====================== */
function selectColor(color) {
  selectedColor = color;
  betAmount = 0;
  betAmountEl.textContent = "0";
  betSection.classList.remove("hidden");
  placeBetBtn.classList.add("disabled");
}

redBtn.onclick = () => selectColor("red");
greenBtn.onclick = () => selectColor("green");

/* ======================
   AMOUNT SELECTION
====================== */
amountBtns.forEach(btn => {
  btn.onclick = () => {
    betAmount = Number(btn.dataset.amount);
    betAmountEl.textContent = betAmount;
    placeBetBtn.classList.remove("disabled");
  };
});

/* ======================
   PLUS BUTTON (DOUBLE)
====================== */
plusBtn.onclick = () => {
  if (betAmount > 0) {
    betAmount *= 2;
    betAmountEl.textContent = betAmount;
  }
};

/* ======================
   PLACE BET
====================== */
placeBetBtn.onclick = async () => {
  if (!selectedColor || betAmount <= 0) return;

  const res = await fetch(API + "/bet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({
      color: selectedColor,
      amount: betAmount
    })
  });

  const data = await res.json();
  alert(data.message || data.error);

  betSection.classList.add("hidden");
};

/* ======================
   LOAD ROUND + WALLET
====================== */
async function loadGame() {
  const r = await fetch(API + "/round/current");
  const rd = await r.json();
  roundIdEl.textContent = rd.id;

  const w = await fetch(API + "/wallet", {
    headers: { Authorization: token }
  });
  const wd = await w.json();
  walletBalance.textContent = "₹" + wd.wallet;
// ✅ Add auto-refresh wallet after bet
placeBetBtn.onclick = async () => {
  if (!selectedColor || betAmount <= 0) return;

  const res = await fetch(API + "/bet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({
      color: selectedColor,
      amount: betAmount
    })
  });

  const data = await res.json();
  
  if (res.ok) {
    alert(data.message);
    // ✅ Reload wallet immediately
    loadGame();
  } else {
    alert(data.error);
  }

  betSection.classList.add("hidden");
  selectedColor = null;
  betAmount = 0;
};
  loadResults();
  loadMyBets();
}

async function loadResults() {
  const res = await fetch(API + "/rounds/history");
  const data = await res.json();
  resultsList.innerHTML = data
    .slice(0, 10)
    .map(r => `<div class="list-item">${r.roundId} → ${r.winner}</div>`)
    .join("");
}

async function loadMyBets() {
  const res = await fetch(API + "/bets", {
    headers: { Authorization: token }
  });
  const data = await res.json();
  myBetsList.innerHTML = data
    .slice(0, 10)
    .map(b => `<div class="list-item">${b.roundId} | ${b.color} | ₹${b.amount} | ${b.status}</div>`)
    .join("");
}

/* ======================
   TABS
====================== */
resultsTab.onclick = () => {
  resultsTab.classList.add("active");
  myBetsTab.classList.remove("active");
  resultsList.classList.remove("hidden");
  myBetsList.classList.add("hidden");
};

myBetsTab.onclick = () => {
  myBetsTab.classList.add("active");
  resultsTab.classList.remove("active");
  myBetsList.classList.remove("hidden");
  resultsList.classList.add("hidden");
};

loadGame();
