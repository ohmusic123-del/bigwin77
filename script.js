let balance = localStorage.getItem("balance");

if (!balance) {
  balance = 100;
  localStorage.setItem("balance", balance);
}

function updateUI() {
  document.querySelectorAll("#balance").forEach(el => {
    el.innerText = balance;
  });
}

updateUI();

function setAmount(val) {
  document.getElementById("amount").value = val;
}

function placeBet(color) {
  const amount = Number(document.getElementById("amount").value);

  if (!amount || amount < 1) {
    alert("Minimum bet is ₹1");
    return;
  }

  if (amount > balance) {
    alert("Insufficient balance");
    return;
  }

  const win = Math.random() > 0.5;
  balance = win ? balance + amount : balance - amount;

  localStorage.setItem("balance", balance);
  updateUI();

  alert(win ? "You Win 🎉" : "You Lose ❌");
}

function resetGame() {
  localStorage.removeItem("balance");
  location.reload();
}
let time = 30;
let bettingOpen = true;

function startRound() {
  time = 30;
  bettingOpen = true;
  document.getElementById("status").innerText = "Betting Open";
  document.getElementById("result").innerText = "";

  const interval = setInterval(() => {
    document.getElementById("timer").innerText = "⏱️ " + time;
    time--;

    if (time < 0) {
      clearInterval(interval);
      closeRound();
    }
  }, 1000);
}

function closeRound() {
  bettingOpen = false;
  document.getElementById("status").innerText = "Result coming...";

  setTimeout(showResult, 3000);
}

function showResult() {
  const winColor = Math.random() < 0.5 ? "RED" : "GREEN";
  document.getElementById("result").innerText = winColor + " WON";
  document.getElementById("status").innerText = "Next round starting...";

  setTimeout(startRound, 3000);
}

document.addEventListener("DOMContentLoaded", startRound);
