const token = localStorage.getItem("token");
if (!token) {
  location.href = "index.html";
}

let selectedColor = null;
let betAmount = 0;

/* ======================
   ROUND INFO
====================== */
async function loadCurrentRound() {
  const res = await fetch(API + "/round/current");
  const data = await res.json();

  document.getElementById("roundId").innerText = data.id;
}
loadCurrentRound();

/* ======================
   COLOR SELECT
====================== */
function selectColor(color) {
  selectedColor = color;
  betAmount = 0;
  document.getElementById("betAmount").innerText = betAmount;

  document.getElementById("amountBox").classList.remove("hidden");

  document.querySelectorAll(".color-btn").forEach(btn =>
    btn.classList.remove("selected")
  );

  document.querySelector("." + color).classList.add("selected");
}

/* ======================
   AMOUNT
====================== */
function selectAmount(amount) {
  betAmount = amount;
  document.getElementById("betAmount").innerText = betAmount;
}

function doubleAmount() {
  if (betAmount === 0) return;
  betAmount = betAmount * 2;
  document.getElementById("betAmount").innerText = betAmount;
}

/* ======================
   PLACE BET
====================== */
async function placeBet() {
  if (!selectedColor || betAmount <= 0) {
    alert("Select color & amount");
    return;
  }

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

  if (data.error) {
    alert(data.error);
  } else {
    alert("Bet placed successfully");
    betAmount = 0;
    document.getElementById("betAmount").innerText = 0;
    loadUserBets();
  }
}

/* ======================
   TABS
====================== */
function showTab(tab) {
  document.querySelectorAll(".tab").forEach(t =>
    t.classList.remove("active")
  );
  document.querySelectorAll(".tab-content").forEach(c =>
    c.classList.add("hidden")
  );

  if (tab === "rounds") {
    document.querySelectorAll(".tab")[0].classList.add("active");
    document.getElementById("rounds").classList.remove("hidden");
  } else {
    document.querySelectorAll(".tab")[1].classList.add("active");
    document.getElementById("bets").classList.remove("hidden");
  }
}

/* ======================
   ROUND HISTORY
====================== */
async function loadRounds() {
  const res = await fetch(API + "/rounds/history");
  const data = await res.json();

  const list = document.getElementById("roundHistory");
  list.innerHTML = "";

  data.forEach(r => {
    list.innerHTML += `
      <li>
        <span>#${r.roundId}</span>
        <b class="${r.winner}">${r.winner.toUpperCase()}</b>
      </li>
    `;
  });
}
loadRounds();

/* ======================
   USER BET HISTORY
====================== */
async function loadUserBets() {
  const res = await fetch(API + "/bets", {
    headers: { Authorization: token }
  });

  const data = await res.json();
  const list = document.getElementById("betHistory");
  list.innerHTML = "";

  data.forEach(b => {
    list.innerHTML += `
      <li>
        <span>${b.color.toUpperCase()} ₹${b.amount}</span>
        <b class="${b.status.toLowerCase()}">${b.status}</b>
      </li>
    `;
  });
}
loadUserBets();
