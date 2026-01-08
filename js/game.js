const API = "http://localhost:3000";
const token = localStorage.getItem("token");

/* ===== ELEMENTS ===== */
const walletEl = document.getElementById("wallet");
const roundIdEl = document.getElementById("roundId");

const tabResults = document.getElementById("tabResults");
const tabMyBets = document.getElementById("tabMyBets");
const resultsBox = document.getElementById("resultsBox");
const betsBox = document.getElementById("betsBox");

/* ===== TAB SWITCH ===== */
tabResults.onclick = () => {
  tabResults.classList.add("active");
  tabMyBets.classList.remove("active");
  resultsBox.classList.remove("hidden");
  betsBox.classList.add("hidden");
};

tabMyBets.onclick = () => {
  tabMyBets.classList.add("active");
  tabResults.classList.remove("active");
  betsBox.classList.remove("hidden");
  resultsBox.classList.add("hidden");
};

/* ===== LOAD WALLET ===== */
async function loadWallet() {
  const res = await fetch(`${API}/wallet`, {
    headers: { Authorization: token }
  });
  const data = await res.json();
  walletEl.innerText = data.wallet;
}

/* ===== LOAD ROUND ===== */
async function loadCurrentRound() {
  const res = await fetch(`${API}/round/current`);
  const data = await res.json();
  roundIdEl.innerText = data.id;
}

/* ===== PLACE BET ===== */
async function placeBet(color, amount) {
  const res = await fetch(`${API}/bet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ color, amount })
  });

  const data = await res.json();
  if (data.error) {
    alert(data.error);
  } else {
    loadWallet();
    loadMyBets();
  }
}

/* ===== ROUND HISTORY ===== */
async function loadRoundHistory() {
  const res = await fetch(`${API}/rounds/history`);
  const data = await res.json();

  const list = document.getElementById("roundHistory");
  list.innerHTML = "";

  data.forEach(r => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${r.roundId}</span>
      <span class="${r.winner}">${r.winner.toUpperCase()}</span>
    `;
    list.appendChild(li);
  });
}

/* ===== USER BET HISTORY ===== */
async function loadMyBets() {
  const res = await fetch(`${API}/bets`, {
    headers: { Authorization: token }
  });
  const data = await res.json();

  const list = document.getElementById("myBets");
  list.innerHTML = "";

  data.forEach(b => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${b.color.toUpperCase()} ₹${b.amount}</span>
      <span>${b.status || "-"}</span>
    `;
    list.appendChild(li);
  });
}

/* ===== AUTO REFRESH ===== */
setInterval(() => {
  loadCurrentRound();
  loadWallet();
  loadRoundHistory();
  loadMyBets();
}, 3000);

/* ===== INIT ===== */
loadCurrentRound();
loadWallet();
loadRoundHistory();
loadMyBets();
