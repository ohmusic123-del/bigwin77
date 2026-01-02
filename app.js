const API = "https://color-game-backend1.onrender.com";
const token = localStorage.getItem("token");

/* 🔐 LOGIN */
async function login() {
  const mobile = document.getElementById("mobile").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "game.html";
  } else {
    document.getElementById("msg").innerText = data.message || "Login failed";
  }
}

/* 🚫 BLOCK GAME IF NOT LOGGED IN */
if (window.location.pathname.includes("game.html") && !token) {
  window.location.href = "index.html";
}

/* 💰 LOAD WALLET */
async function loadGame() {
  const res = await fetch(API + "/api/user/me", {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();
  document.getElementById("wallet").innerText =
    data.wallet ?? data.balance ?? 0;

  startTimer();
}

/* 🎯 PLACE BET */
async function placeBet(color) {
  const amount = Number(document.getElementById("amount").value);
  if (!amount || amount <= 0) {
    alert("Enter valid amount");
    return;
  }

  const res = await fetch(API + "/api/game/bet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ color, amount })
  });

  const data = await res.json();

  document.getElementById("wallet").innerText =
    data.wallet ?? data.balance ?? 0;

  document.getElementById("msg").innerText =
    data.message || data.result || "Bet placed";
}

/* ⏱ TIMER */
function startTimer() {
  let time = 30;
  const t = document.getElementById("timer");

  setInterval(() => {
    time--;
    if (time <= 0) time = 30;
    t.innerText = time;
  }, 1000);
}

/* 🚪 LOGOUT */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
