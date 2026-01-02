const API = "https://color-game-backend1.onrender.com";

/* =====================
   LOGIN
===================== */
async function login() {
  const mobile = document.getElementById("mobile").value;
  const password = document.getElementById("password").value;

  if (!mobile || !password) {
    document.getElementById("msg").innerText = "Enter mobile & password";
    return;
  }

  try {
    const res = await fetch(API + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, password })
    });

    const data = await res.json();

    if (!res.ok) {
      document.getElementById("msg").innerText = data.message;
      return;
    }

    // SAVE TOKEN & WALLET
    localStorage.setItem("token", data.token);
    localStorage.setItem("wallet", data.wallet);

    // GO TO GAME
    window.location.href = "game.html";

  } catch (err) {
    document.getElementById("msg").innerText = "Server error";
  }
}

/* =====================
   GAME PAGE LOAD
===================== */
function loadGame() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("wallet").innerText =
    localStorage.getItem("wallet");
}

/* =====================
   PLACE BET
===================== */
async function placeBet(color) {
  const amount = document.getElementById("amount").value;
  const token = localStorage.getItem("token");

  if (!amount || amount <= 0) {
    alert("Enter valid amount");
    return;
  }

  const res = await fetch(API + "/bet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ color, amount })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message);
    return;
  }

  // UPDATE WALLET
  localStorage.setItem("wallet", data.wallet);
  document.getElementById("wallet").innerText = data.wallet;

  document.getElementById("msg").innerText =
    "Result: " + data.result;
}

/* =====================
   LOGOUT
===================== */
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
