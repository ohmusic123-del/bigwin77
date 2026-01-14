async function updateRound() {
  try {
    const res = await fetch(API + "/round/current");
    const data = await res.json();

    // Update round ID
    document.getElementById("roundId").innerText = data.id;

    // Calculate remaining time
    const elapsed = Math.floor((Date.now() - data.startTime) / 1000);
    const remaining = Math.max(0, 30 - elapsed);

    document.getElementById("timeLeft").innerText = remaining;
  } catch (err) {
    console.error("Round fetch error", err);
  }
}

// Update every second
updateRound();
setInterval(updateRound, 1000);
