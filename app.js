// 🔒 TEMP TOKEN (paste your real token here)
const TOKEN = "PASTE_YOUR_LOGIN_TOKEN_HERE";

// 🔗 Backend URL
const API = "https://color-game-backend1.onrender.com";

// Load wallet on page load
document.addEventListener("DOMContentLoaded", () => {
  loadWallet();
});

async function loadWallet() {
  try {
    const res = await fetch(API + "/profile", {
      headers: {
        Authorization: "Bearer " + TOKEN
      }
    });
    const data = await res.json();
    document.getElementById("wallet").innerText = data.wallet;
  } catch (e) {
    document.getElementById("wallet").innerText = "Error";
  }
}

async function placeBet(color) {
  const amount = document.getElementById("amount").value;

  if (!amount || amount <= 0) {
    alert("Enter valid amount");
    return;
  }

  try {
    const res = await fetch(API + "/bet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + TOKEN
      },
      body: JSON.stringify({ color, amount })
    });

    const data = await res.json();
    document.getElementById("message").innerText =
      "Result: " + data.result + " | Wallet: ₹" + data.wallet;

    document.getElementById("wallet").innerText = data.wallet;
  } catch (err) {
    alert("Bet failed");
  }
}
