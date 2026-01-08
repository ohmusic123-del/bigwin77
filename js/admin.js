const API = "http://localhost:3000";
const ADMIN_KEY = "bigwin_admin_123";

async function loadWithdraws() {
  const res = await fetch(`${API}/admin/withdraws`, {
    headers: {
      "x-admin-key": ADMIN_KEY
    }
  });

  const data = await res.json();
  const table = document.getElementById("withdrawTable");
  table.innerHTML = "";

  data.forEach(w => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${w.mobile}</td>
      <td>₹${w.amount}</td>
      <td>${w.method.toUpperCase()}</td>
      <td>${formatDetails(w.details)}</td>
      <td class="status ${w.status.toLowerCase()}">${w.status}</td>
      <td>
        ${w.status === "PENDING" ? `
          <button class="approve" onclick="updateWithdraw('${w._id}','APPROVED')">Approve</button>
          <button class="reject" onclick="updateWithdraw('${w._id}','REJECTED')">Reject</button>
        ` : "-"}
      </td>
    `;

    table.appendChild(tr);
  });
}

function formatDetails(d) {
  if (!d) return "-";
  if (d.upiId) return `UPI: ${d.upiId}`;
  if (d.accountNumber) return `Bank: ${d.accountNumber}`;
  if (d.usdtAddress) return `USDT: ${d.usdtAddress}`;
  return "-";
}

async function updateWithdraw(id, status) {
  const note = prompt("Admin note (optional):") || "";

  const res = await fetch(`${API}/admin/withdraw/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": ADMIN_KEY
    },
    body: JSON.stringify({ status, adminNote: note })
  });

  const data = await res.json();
  alert(data.message || "Updated");

  loadWithdraws();
}

/* AUTO REFRESH */
setInterval(loadWithdraws, 5000);

/* INIT */
loadWithdraws();
