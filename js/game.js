// ==========================
// GAME STATE
// ==========================
let selectedColor = null;
let betAmount = 0;
let selectedBaseAmount = 0;

// ==========================
// DOM ELEMENTS
// ==========================
const redBtn = document.getElementById("redBtn");
const greenBtn = document.getElementById("greenBtn");
const betSection = document.getElementById("betSection");
const betAmountSpan = document.getElementById("betAmount");
const placeBetBtn = document.getElementById("placeBetBtn");
const plusBtn = document.getElementById("plusBtn");

const resultsTab = document.getElementById("resultsTab");
const myBetsTab = document.getElementById("myBetsTab");
const resultsList = document.getElementById("resultsList");
const myBetsList = document.getElementById("myBetsList");

// ==========================
// COLOR SELECTION
// ==========================
redBtn.addEventListener("click", () => selectColor("RED"));
greenBtn.addEventListener("click", () => selectColor("GREEN"));

function selectColor(color) {
  selectedColor = color;

  redBtn.classList.remove("active");
  greenBtn.classList.remove("active");

  color === "RED" ? redBtn.classList.add("active") : greenBtn.classList.add("active");

  betSection.classList.remove("hidden");
  resetBet();
}

// ==========================
// BET AMOUNT BUTTONS
// ==========================
document.querySelectorAll(".amount-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedBaseAmount = parseInt(btn.dataset.amount);
    betAmount = selectedBaseAmount;
    updateBetUI();
  });
});

// ==========================
// PLUS BUTTON (DOUBLE BET)
// ==========================
plusBtn.addEventListener("click", () => {
  if (betAmount > 0) {
    betAmount *= 2;
    updateBetUI();
  }
});

// ==========================
// PLACE BET
// ==========================
placeBetBtn.addEventListener("click", async () => {
  if (!selectedColor || betAmount <= 0) return;

  placeBetBtn.classList.add("disabled");
  placeBetBtn.innerText = "Placing...";

  try {
    const res = await fetch(`${API}/bet/place`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        color: selectedColor,
        amount: betAmount
      })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Bet failed");

    resetBet();
    loadMyBets();
    alert("Bet placed successfully");

  } catch (err) {
    alert(err.message);
  } finally {
    placeBetBtn.classList.remove("disabled");
    placeBetBtn.innerText = "Place Bet";
  }
});

// ==========================
// UI HELPERS
// ==========================
function updateBetUI() {
  betAmountSpan.innerText = betAmount;
  placeBetBtn.classList.toggle("disabled", betAmount <= 0);
}

function resetBet() {
  betAmount = 0;
  selectedBaseAmount = 0;
  updateBetUI();
}

// ==========================
// TABS
// ==========================
resultsTab.addEventListener("click", () => {
  resultsTab.classList.add("active");
  myBetsTab.classList.remove("active");
  resultsList.classList.remove("hidden");
  myBetsList.classList.add("hidden");
});

myBetsTab.addEventListener("click", () => {
  myBetsTab.classList.add("active");
  resultsTab.classList.remove("active");
  myBetsList.classList.remove("hidden");
  resultsList.classList.add("hidden");
});

// ==========================
// LOAD RESULTS (LAST 10)
// ==========================
async function loadResults() {
  try {
    const res = await fetch(`${API}/round/results`);
    const data = await res.json();

    resultsList.innerHTML = "";
    data.slice(0, 10).forEach(r => {
      const row = document.createElement("div");
      row.className = "history-row";
      row.innerHTML = `
        <span>#${r.roundId}</span>
        <span class="${r.result === "RED" ? "text-red" : "text-green"}">
          ${r.result}
        </span>
      `;
      resultsList.appendChild(row);
    });
  } catch {
    resultsList.innerHTML = "<p>No results</p>";
  }
}

// ==========================
// LOAD USER BET HISTORY
// ==========================
async function loadMyBets() {
  try {
    const res = await fetch(`${API}/bet/my`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = await res.json();
    myBetsList.innerHTML = "";

    data.forEach(b => {
      const row = document.createElement("div");
      row.className = "history-row";
      row.innerHTML = `
        <span>${b.color} - ₹${b.amount}</span>
        <span class="${b.status === "WIN" ? "text-green" : b.status === "LOSS" ? "text-red" : ""}">
          ${b.status}
        </span>
      `;
      myBetsList.appendChild(row);
    });

  } catch {
    myBetsList.innerHTML = "<p>No bets found</p>";
  }
}

// ==========================
// INIT
// ==========================
loadResults();
loadMyBets();
