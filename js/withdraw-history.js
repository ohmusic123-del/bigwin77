const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

async function loadWithdrawHistory() {
  const div = document.getElementById("history");
  div.innerHTML = "Loading...";

  try {
    const res = await fetch(`${API_BASE}/api/wallet/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!res.ok) {
      div.innerHTML = data.error || "Failed";
      return;
    }

    const withdraws = data.withdraws || [];
    if (!withdraws.length) {
      div.innerHTML = "<p>No withdraws found ✅</p>";
      return;
    }

    div.innerHTML = withdraws
      .map(
        (w) => `
      <div class="card">
        <p><b>Amount:</b> ₹${w.amount}</p>
        <p><b>Status:</b> ${w.status}</p>
        <p><b>Method:</b> ${w.method}</p>
        <p><b>UPI:</b> ${w.upiId}</p>
      </div>
    `
      )
      .join("");
  } catch (e) {
    div.innerHTML = e.message;
  }
}

loadWithdrawHistory();
