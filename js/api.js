const API_URL = "https://bigwin-game-backend1.onrender.com";

// ---- AUTH ----
async function apiLogin(phone, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, password })
  });
  return res.json();
}

async function apiRegister(phone, password) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, password })
  });
  return res.json();
}

// ---- WALLET ----
async function apiWallet() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/api/wallet`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

// ---- GAME ----
async function apiPlaceBet(amount, color) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/api/game/bet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ amount, color })
  });
  return res.json();
}
