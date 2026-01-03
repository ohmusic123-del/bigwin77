const BACKEND_URL = "https://color-game-backend1.onrender.com";

let token = "";
let wallet = 0;

/* HELPERS */
function setAmount(val) {
  document.getElementById("amount").value = val;
}

function showGame() {
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("gameBox").classList.remove("hidden");
}

function updateWallet(val) {
  wallet = Math.floor(val);
  document.getElementById("wallet").innerText = wallet;
}

/* AUTH */
async function register() {
  const mobile = mobile.value;
  const password = password.value;

  const res = await fetch(`${BACKEND_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, password })
  });

  const data = await res.json();
  alert(data.message || "Registered");
}

async function login() {
  const mobile = document.getElementById("mobile").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${BACKEND_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, password })
  });

  const data = await res.json();

  if (!data.token) {
    alert(data.message || "Login failed");
    return;
  }

  token = data.token;
  updateWallet(data.wallet);
  showGame();
}

/* BET */
async function bet(color) {
  const amount = Number(document.getElementById("amount").value);

  if (!amount || amount < 1) {
    alert("Minimum bet is ₹1");
    return;
  }

  const res = await fetch(`${BACKEND_URL}/bet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ color, amount })
  });

  const data = await res.json();

  if (data.message) {
    alert(data.message);
  }

  // refresh wallet from backend
  const me = await fetch(`${BACKEND_URL}/me`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const meData = await me.json();
  if (meData.wallet !== undefined) {
    updateWallet(meData.wallet);
  }
}
