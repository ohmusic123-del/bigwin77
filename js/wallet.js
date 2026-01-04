const API = "https://color-game-backend1.onrender.com";
const token = localStorage.getItem("token");

async function loadWallet() {
  const res = await fetch(`${API}/wallet`, {
    headers: { Authorization: token }
  });
  const data = await res.json();
  document.getElementById("balance").innerText = `₹${data.wallet}`;
}

async function loadBets() {
  const res = await fetch(`${API}/bets`, {
    headers: { Authorization: token }
  });

  const bets = await res.json();
  const list = document.getElementById("betList");
  list.innerHTML = "";

  if (!bets.length) {
    list.innerHTML = "<li>No bets yet</li>";
    return;
  }

  bets.forEach(b => {
    const li = document.createElement("li");
    li.innerText =
      `${b.color.toUpperCase()} | ₹${b.amount} | ${new Date(b.createdAt).toLocaleTimeString()}`;
    list.appendChild(li);
  });
}

loadWallet();
loadBets();

setInterval(() => {
  loadWallet();
  loadBets();
}, 5000);

function openDeposit() {
  document.getElementById("depositModal").style.display = "flex";
}

function closeDeposit() {
  document.getElementById("depositModal").style.display = "none";
}

async function submitDeposit() {
  const amount = Number(document.getElementById("depositAmount").value);

  if (amount < 100) {
    alert("Minimum deposit is ₹100");
    return;
  }

  const res = await fetch(`${API}/deposit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ amount })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Deposit failed");
    return;
  }

  alert("Deposit successful");
  closeDeposit();
  loadWallet();
}
