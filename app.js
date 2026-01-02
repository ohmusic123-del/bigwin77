const API = "https://color-game-backend1.onrender.com";

// DEBUG helper so you can see API responses
async function safeFetch(url, options) {
  try {
    const res = await fetch(url, options);
    const data = await res.json();
    console.log("API RESPONSE:", data);
    return data;
  } catch (err) {
    alert("Backend not reachable");
    console.error(err);
    return {};
  }
}

// AUTO LOGIN
if (localStorage.getItem("token")) {
  showGame();
}

// REGISTER
async function register() {
  const mobile = document.getElementById("mobile").value;
  const password = document.getElementById("password").value;

  const data = await safeFetch(API + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, password })
  });

  if (data.message) alert(data.message);
}

// LOGIN
async function login() {
  const mobile = document.getElementById("mobile").value;
  const password = document.getElementById("password").value;

  const data = await safeFetch(API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, password })
  });

  console.log("LOGIN DATA:", data);

  if (data.token) {
    localStorage.setItem("token", data.token);
    document.getElementById("wallet").innerText = data.wallet;
    showGame();
  } else {
    alert(data.message || "Login failed");
  }
}

// PLACE BET
async function bet(color) {
  const amount = document.getElementById("amount").value;
  const token = localStorage.getItem("token");

  const data = await safeFetch(API + "/bet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ color, amount })
  });

  if (data.message) alert(data.message);
  if (data.wallet !== undefined) {
    document.getElementById("wallet").innerText = data.wallet;
  }
}

// LOGOUT
function logout() {
  localStorage.removeItem("token");
  location.reload();
}

// UI
function showGame() {
  document.getElementById("auth").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
}
