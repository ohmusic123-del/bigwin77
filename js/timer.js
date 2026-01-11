const timeLeftEl = document.getElementById("timeLeft");

async function updateTimer() {
  const res = await fetch(API + "/round/current");
  const data = await res.json();

  const elapsed = Math.floor((Date.now() - data.startTime) / 1000);
  const remaining = Math.max(0, 30 - elapsed);

  timeLeftEl.textContent = remaining;
}

setInterval(updateTimer, 1000);
updateTimer();
