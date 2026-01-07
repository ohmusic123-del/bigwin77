const API = "https://color-game-backend1.onrender.com";
const ADMIN_KEY = "bigwin_admin_123";

/* ======================
   LOAD WITHDRAWS
====================== */
async function loadWithdraws() {
  const res = await fetch(`${API}/admin/withdraws`, {
    headers: {
      "x-admin-key": ADMIN_KEY
    }
  });

  const data = await res.json();
  const div = document.getElementById("list");
  div.innerHTML = "";

  if (!data.length) {
    div.innerText = "No withdrawal requests";
    return;
  }

  data.forEach(w => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="row">📱 Mobile: ${w.mobile}</div>
      <div class="row">💰 Amount: ₹${w.amount}</div>
      <div class="row">🏦 Method: ${w.method}</div>
      <div class="row">🕒 Date: ${new Date(w.createdAt).toLocaleString()}</div>

      <div class="status ${w.status.toLowerCase()}">
        Status: ${w.status}
      </div>

      ${
        w.status === "PENDING"
          ? `
            <button class="approve" onclick="process('${w._id}','APPROVED')">
              Approve
            </button>
            <button class="reject" onclick="process('${w._id}','REJECTED')">
              Reject
            </button>
          `
          : ""
      }
    `;

    div.appendChild(card);
  });
}

/* ======================
   PROCESS WITHDRAW
====================== */
async function process(id, status) {
  let note = "";

  if (status === "REJECTED") {
    note = prompt("Rejection reason (optional)");
  }

  const res = await fetch(`${API}/admin/withdraw/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": ADMIN_KEY
    },
    body: JSON.stringify({
      status,
      adminNote: note
    })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Failed");
    return;
  }

  alert(data.message);
  loadWithdraws();
}

/* ======================
   INIT
====================== */
loadWithdraws();
setInterval(loadWithdraws, 5000);
