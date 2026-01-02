const API = "https://color-game-backend1.onrender.com";

// Auto login check
if (localStorage.getItem("token")) {
  showGame();
}

// REGISTER
async function register() {
  const mobile = mobileInput();
  const password = passwordInput();

  const res = await fetch(API + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, password })
  });

  const data = await res.json();
  alert(data.message);
}

// LOGIN
async function login() {
  const mobile = mobileInput();
  const password = passwordInput();

  const res = await fetch(API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    document.getElementById("wallet").innerText = data.wallet;
    showGame();
  } else {
    alert(data.message);
  }
}

// PLACE BET
async function bet(color) {
  const amount = document.getElementById("amount").value;
  const token = localStorage.getItem("token");

  const res = await fetch(API + "/bet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ color, amount })
  });

  const data = await res.json();
  alert(data.message);
}

// LOGOUT
function logout() {
  localStorage.removeItem("token");
  location.reload();
}

// UI HELPERS
function showGame() {
  document.getElementById("auth").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
}

function mobileInput() {
  return document.getElementById("mobile").value;
}

function passwordInput() {
  return document.getElementById("password").value;
}
