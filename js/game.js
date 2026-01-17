const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

let currentRound = null;

async function fetchCurrentRound() {
  const res = await fetch(`${API_BASE}/api/game/round`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) return alert(data.error || "Failed to get round");
  currentRound = data.round;
  updateTimerUI();
}

function updateTimerUI() {
  if (!currentRound) return;
  const end = new Date(currentRound.endTime).getTime();
  const now = Date.now();
  let sec = Math.max(0, Math.ceil((end - now) / 1000));
  const el = document.getElementById("timer");
  if (el) el.innerText = sec;
}

setInterval(updateTimerUI, 500);

async function placeBet(color) {
  const amount = Number(document.getElementById("betAmount")?.value || 0);
  if (!amount || amount <= 0) return alert("Enter valid amount");

  const res = await fetch(`${API_BASE}/api/game/bet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount, color }),
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error || "Bet failed");

  alert("Bet placed ✅");
}

window.placeBet = placeBet;

// Realtime updates
const socket = io(API_BASE);

socket.on("round:started", (payload) => {
  currentRound = payload.round;
});

socket.on("round:ended", (payload) => {
  alert(`Round ended! Winning color: ${payload.winningColor}`);
});

fetchCurrentRound();
