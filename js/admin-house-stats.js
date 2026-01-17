const token = localStorage.getItem("adminToken");
if (!token) window.location.href = "admin-login.html";

async function loadStats() {
  const sumDiv = document.getElementById("summary");
  const rowsDiv = document.getElementById("rows");
  sumDiv.innerHTML = "Loading...";
  rowsDiv.innerHTML = "";

  const res = await fetch(`${API_BASE}/api/admin/stats/house`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) return (sumDiv.innerHTML = data.error || "Failed");

  sumDiv.innerHTML = `
    <div class="card">
      <p><b>Total Bet:</b> ₹${data.summary.totalBet}</p>
      <p><b>Total Payout:</b> ₹${data.summary.totalPayout}</p>
      <p><b>Profit:</b> ₹${data.summary.profit}</p>
    </div>
  `;

  rowsDiv.innerHTML = (data.rows || [])
    .map(
      (r) => `
    <div class="card">
      <p><b>Round:</b> ${r.roundId}</p>
      <p>Bet: ₹${r.totalBet} | Payout: ₹${r.totalPayout} | Profit: ₹${r.profit}</p>
      <p style="font-size:12px;opacity:0.8">${new Date(r.createdAt).toLocaleString()}</p>
    </div>
  `
    )
    .join("");
}

window.loadStats = loadStats;
