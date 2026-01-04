const API = "https://color-game-backend1.onrender.com";

let selectedColor = null;
let selectedAmount = 0;
let timeLeft = 30;
let roundId = Date.now();

const timerEl = document.getElementById("timer");
const statusEl = document.getElementById("status");
const roundEl = document.getElementById("roundId");

roundEl.innerText = "Round: " + roundId;

function selectColor(color) {
  selectedColor = color;
  statusEl.innerText = `Selected: ${color.toUpperCase()}`;
}

function selectAmount(amount) {
  selectedAmount = amount;
  statusEl.innerText = `Amount: ₹${amount}`;
}

async function placeBet() {
  if (!selectedColor || !selectedAmount) {
    alert("Select color and amount");
    return;
  }

  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/bet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({
      color: selectedColor,
      amount: selectedAmount,
      roundId
    })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Bet failed");
    return;
  }

  statusEl.innerText = "Bet placed successfully";
}

function startTimer() {
  setInterval(() => {
    timeLeft--;
    timerEl.innerText = timeLeft;

    if (timeLeft === 0) {
      statusEl.innerText = "Round ended";
    }

    if (timeLeft < 0) {
      timeLeft = 30;
      roundId = Date.now();
      roundEl.innerText = "Round: " + roundId;
      statusEl.innerText = "";
    }
  }, 1000);
}

startTimer();
