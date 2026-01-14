const API = "https://color-game-backend1.onrender.com";

// ✅ IMMEDIATE DEBUG
console.log("🚀 Game.js starting to load...");
console.log("API:", API);
console.log("Token exists:", !!localStorage.getItem("token"));

let selectedColor = null;
let betAmount = 0;

const walletBalance = document.getElementById("walletBalance");
const roundIdEl = document.getElementById("roundId");
const timeLeftEl = document.getElementById("timeLeft");

const redBtn = document.getElementById("redBtn");
const greenBtn = document.getElementById("greenBtn");

const betSection = document.getElementById("betSection");
const betAmountEl = document.getElementById("betAmount");
const placeBetBtn = document.getElementById("placeBetBtn");
const plusBtn = document.getElementById("plusBtn");

const amountBtns = document.querySelectorAll(".amount-btn");

const resultsTab = document.getElementById("resultsTab");
const myBetsTab = document.getElementById("myBetsTab");
const resultsList = document.getElementById("resultsList");
const myBetsList = document.getElementById("myBetsList");

const token = localStorage.getItem("token");

console.log("✅ All elements found:", {
  walletBalance: !!walletBalance,
  roundIdEl: !!roundIdEl,
  timeLeftEl: !!timeLeftEl,
  redBtn: !!redBtn,
  greenBtn: !!greenBtn
});

if (!token) {
  console.error("❌ No token found, redirecting to login");
  alert("Please login first");
  location.href = "index.html";
}

/* ======================
   COLOR SELECTION
====================== */
function selectColor(color) {
  console.log("Color selected:", color);
  selectedColor = color;
  betAmount = 0;
  betAmountEl.textContent = "0";
  betSection.classList.remove("hidden");
  placeBetBtn.classList.add("disabled");
}

if (redBtn) redBtn.onclick = () => selectColor("red");
if (greenBtn) greenBtn.onclick = () => selectColor("green");

/* ======================
   AMOUNT SELECTION
====================== */
amountBtns.forEach(btn => {
  btn.onclick = () => {
    betAmount = Number(btn.dataset.amount);
    betAmountEl.textContent = betAmount;
    placeBetBtn.classList.remove("disabled");
  };
});

/* ======================
   PLUS BUTTON (DOUBLE)
====================== */
if (plusBtn) {
  plusBtn.onclick = () => {
    if (betAmount > 0) {
      betAmount *= 2;
      betAmountEl.textContent = betAmount;
    }
  };
}

/* ======================
   PLACE BET
====================== */
if (placeBetBtn) {
  placeBetBtn.onclick = async () => {
    if (!selectedColor || betAmount <= 0) {
      alert("Select color and amount first");
      return;
    }

    try {
      const res = await fetch(API + "/bet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({
          color: selectedColor,
          amount: betAmount
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        loadGame();
        betSection.classList.add("hidden");
        selectedColor = null;
        betAmount = 0;
      } else {
        alert(data.error || "Bet failed");
      }
    } catch (err) {
      console.error("Bet error:", err);
      alert("Network error. Please try again.");
    }
  };
}

/* ======================
   TIMER
====================== */
async function updateTimer() {
  try {
    const res = await fetch(API + "/round/current");
    const data = await res.json();

    console.log("Round data:", data);

    if (data.id) {
      roundIdEl.textContent = data.id.substring(0, 8);
      
      const elapsed = Math.floor((Date.now() - data.startTime) / 1000);
      const remaining = Math.max(0, 30 - elapsed);
      
      timeLeftEl.textContent = remaining;

      if (remaining === 0) {
        setTimeout(() => {
          loadResults();
          loadMyBets();
          loadWallet();
        }, 2000);
      }
    }
  } catch (err) {
    console.error("Timer error:", err);
  }
}

/* ======================
   LOAD WALLET
====================== */
async function loadWallet() {
  try {
    console.log("Loading wallet...");
    const res = await fetch(API + "/wallet", {
      headers: { Authorization: token }
    });
    
    const data = await res.json();
    console.log("Wallet data:", data);
    
    if (data.wallet !== undefined) {
      walletBalance.textContent = "₹" + data.wallet;
    }
  } catch (err) {
    console.error("Wallet error:", err);
  }
}

/* ======================
   LOAD RESULTS
====================== */
async function loadResults() {
  try {
    const res = await fetch(API + "/rounds/history");
    const data = await res.json();
    
    if (data && data.length > 0) {
      resultsList.innerHTML = data
        .slice(0, 10)
        .map(r => {
          const colorClass = r.winner === 'red' ? 'style="color: #ff4444;"' : 'style="color: #44ff44;"';
          return `<div class="list-item">
            Round ${r.roundId.substring(0, 8)} → 
            <span ${colorClass}>${r.winner.toUpperCase()}</span>
          </div>`;
        })
        .join("");
    } else {
      resultsList.innerHTML = "<div class='list-item'>No results yet</div>";
    }
  } catch (err) {
    console.error("Results error:", err);
    resultsList.innerHTML = "<div class='list-item'>Failed to load results</div>";
  }
}

/* ======================
   LOAD MY BETS
====================== */
async function loadMyBets() {
  try {
    const res = await fetch(API + "/bets", {
      headers: { Authorization: token }
    });
    
    const data = await res.json();
    
    if (data && data.length > 0) {
      myBetsList.innerHTML = data
        .slice(0, 10)
        .map(b => {
          const statusColor = 
            b.status === 'WON' ? 'style="color: #44ff44;"' :
            b.status === 'LOST' ? 'style="color: #ff4444;"' :
            'style="color: #ffaa00;"';
          
          return `<div class="list-item">
            ${b.color.toUpperCase()} | ₹${b.amount} | 
            <span ${statusColor}>${b.status}</span>
          </div>`;
        })
        .join("");
    } else {
      myBetsList.innerHTML = "<div class='list-item'>No bets yet</div>";
    }
  } catch (err) {
    console.error("Bets error:", err);
    myBetsList.innerHTML = "<div class='list-item'>Failed to load bets</div>";
  }
}

/* ======================
   LOAD GAME
====================== */
async function loadGame() {
  console.log("🎮 Loading game...");
  loadWallet();
  loadResults();
  loadMyBets();
}

/* ======================
   TABS
====================== */
if (resultsTab) {
  resultsTab.onclick = () => {
    resultsTab.classList.add("active");
    myBetsTab.classList.remove("active");
    resultsList.classList.remove("hidden");
    myBetsList.classList.add("hidden");
  };
}

if (myBetsTab) {
  myBetsTab.onclick = () => {
    myBetsTab.classList.add("active");
    resultsTab.classList.remove("active");
    myBetsList.classList.remove("hidden");
    resultsList.classList.add("hidden");
  };
}

/* ======================
   INIT
====================== */
console.log("🎯 Initializing game...");
loadGame();
setInterval(updateTimer, 1000);
updateTimer();

console.log("✅ Game.js loaded successfully!");

// ✅ Visual confirmation
setTimeout(() => {
  if (walletBalance && walletBalance.textContent === "₹0") {
    console.error("⚠️ Game didn't load! Check console for errors.");
    alert("Game loading issue detected. Please refresh the page.");
  }
}, 3000);
