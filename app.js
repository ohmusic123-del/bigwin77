const API = "https://color-game-backend1.onrender.com";

// REGISTER
async function register() {
  const mobile = document.getElementById("mobile").value;
  const password = document.getElementById("password").value;

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
  const mobile = document.getElementById("mobile").value;
  const password = document.getElementById("password").value;

  const res = await fetch("https://color-game-backend1.onrender.com/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, password })
  });

  const data = await res.json();
  console.log("LOGIN RESPONSE:", data);

  if (data.token) {
    localStorage.setItem("token", data.token);

    document.getElementById("wallet").innerText = data.wallet;

    document.getElementById("auth").style.display = "none";
    document.getElementById("game").style.display = "block";

    alert("Login successful");
  } else {
    alert(data.message || "Login failed");
  }
}

// BET
async function placeBet(color) {
  const amount = document.getElementById("amount").value;
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login again");
    return;
  }

  const res = await fetch("https://color-game-backend1.onrender.com/bet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token   // ✅ THIS LINE FIXES EVERYTHING
    },
    body: JSON.stringify({ color, amount })
  });

  const data = await res.json();

  if (data.message) {
    alert(data.message);
  }
}
