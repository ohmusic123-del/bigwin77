const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

async function loadDepositHistory() {
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

    const deposits = data.deposits || [];
    if (!deposits.length) {
      div.innerHTML = "<p>No deposits found ✅</p>";
      return;
    }

    div.innerHTML = deposits
      .map(
        (d) => `
      <div class="card">
        <p><b>Amount:</b> ₹${d.amount}</p>
        <p><b>Status:</b> ${d.status}</p>
        <p><b>Ref:</b> ${d.referenceId}</p>
      </div>
    `
      )
      .join("");
  } catch (e) {
    div.innerHTML = e.message;
  }
}

loadDepositHistory();
