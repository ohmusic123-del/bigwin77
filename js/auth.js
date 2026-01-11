const API = window.API || "https://color-game-backend1.onrender.com";

function getInput(id) {
  return document.getElementById(id).value.trim();
}

/* ======================
   REGISTER
====================== */
async function register() {
  const mobile = getInput("mobile");
  const password = getInput("password");

  if (!mobile || !password) {
    alert("Enter mobile and password");
    return;
  }

  const res = await fetch(API + "/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ mobile, password })
  });

  const data = await res.json();

  if (res.ok) {
    alert("Registered successfully. Please login.");
  } else {
    alert(data.error || "Registration failed");
  }
}

/* ======================
   LOGIN
====================== */
async function login() {
  const mobile = getInput("mobile");
  const password = getInput("password");

  if (!mobile || !password) {
    alert("Enter mobile and password");
    return;
  }

  const res = await fetch(API + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ mobile, password })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Login failed");
    return;
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("wallet", data.wallet);

  window.location.href = "home.html";
}
