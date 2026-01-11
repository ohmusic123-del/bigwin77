/* =========================
   GAME STATE
========================= */
let selectedColor = null;
let selectedAmount = 0;

/* =========================
   ELEMENTS
========================= */
const redBtn = document.getElementById("redBtn");
const greenBtn = document.getElementById("greenBtn");
const betSection = document.getElementById("betSection");

const amountBtns = document.querySelectorAll(".amt-btn");
const betAmountEl = document.getElementById("betAmount");
const plusBtn = document.getElementById("plusBtn");
const placeBetBtn = document.getElementById("placeBetBtn");

const resultsList = document.getElementById("resultsList");
const myBetsList = document.getElementById("myBetsList");

/* =========================
   COLOR SELECTION
========================= */
redBtn.onclick = () => selectColor("red");
greenBtn.onclick = () => selectColor("green");

function selectColor(color) {
  selectedColor = color;

  redBtn.classList.remove("active");
  greenBtn.classList.remove("active");

  if (color === "red") redBtn.classList.add("active");
  if (color === "green") greenBtn.classList.add("active");

  betSection.classList.remove("hidden");
  resetBet();
}

/* =========================
   AMOUNT BUTTONS
========================= */
amountBtns.forEach(btn => {
  btn.onclick = () => {
    selectedAmount = parseInt(btn.dataset.amt);
    updateAmount();
  };
});

/* =========================
   PLUS BUTTON (DOUBLE)
========================= */
plusBtn.onclick = () => {
  if (selectedAmount > 0) {
    selectedAmount *= 2;
    updateAmount();
  }
};

function updateAmount() {
  betAmountEl.innerText = selectedAmount;
  placeBetBtn.disabled = selectedAmount <= 0;
}

function resetBet() {
  selectedAmount = 0;
  betAmountEl.innerText = "0";
  placeBetBtn.disabled = true;
}

/* =========================
   PLACE BET (FIXED API)
========================= */
placeBetBtn.onclick = async () => {
  if (!selectedColor || selectedAmount <= 0) {
    alert("Select color and amount");
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

  resetBet();
  loadMyBets();
};

/* =========================
   LOAD LAST 10 RESULTS (FIXED)
========================= */
async function loadResults() {
  const res = await fetch(`${API}/rounds/history`);
  const data = await res.json();

  resultsList.innerHTML = "";

  data.slice(0, 10).forEach(r => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>#${r.roundId}</span>
      <span class="${r.winner === "red" ? "red" : "green"}">
        ${r.winner.toUpperCase()}
      </span>
    `;
    resultsList.appendChild(li);
  });
}

/* =========================
   LOAD MY BETS (FIXED)
========================= */
async function loadMyBets() {
  const res = await fetch(`${API}/bets`, {
    headers: {
      Authorization: localStorage.getItem("token")
    }
  });

  const data = await res.json();
  myBetsList.innerHTML = "";

  data.forEach(b => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>₹${b.amount}</span>
      <span class="${b.color === "red" ? "red" : "green"}">
        ${b.color.toUpperCase()}
      </span>
      <span>${b.status}</span>
    `;
    myBetsList.appendChild(li);
  });
}

/* =========================
   TABS
========================= */
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.getElementById("resultsTab").classList.add("hidden");
    document.getElementById("myBetsTab").classList.add("hidden");

    if (btn.dataset.tab === "results") {
      document.getElementById("resultsTab").classList.remove("hidden");
    } else {
      document.getElementById("myBetsTab").classList.remove("hidden");
    }
  };
});

/* =========================
   INIT
========================= */
loadResults();
loadMyBets();
