const API = "https://color-game-backend1.onrender.com";
const token = localStorage.getItem("adminToken");

if (!token) location.href = "admin-login.html";

async function loadWithdraws() {
  const res = await fetch(API + "/admin/withdraws", {
    headers: { Authorization: token }
  });

  const data = await res.json();
  const list = document.getElementById("withdrawList");
  list.innerHTML = "";

  if (!data.length) {
    list.innerHTML = "<p>No withdrawal requests</p>";
    return;
  }

  data.forEach(w => {
    list.innerHTML += `
      <div class="card">
        <div><b>Mobile:</b> ${w.mobile}</div>
        <div><b>Amount:</b> ₹${w.amount}</div>
        <div><b>Method:</b> ${w.method}</div>
        <div><b>Status:</b> ${w.status}</div>

        ${w.details?.upiId ? `<div><b>UPI:</b> ${w.details.upiId}</div>` : ""}
        ${w.details?.bankName ? `<div><b>Bank:</b> ${w.details.bankName}</div>` : ""}
        ${w.details?.usdtAddress ? `<div><b>USDT:</b> ${w.details.usdtAddress}</div>` : ""}

        <textarea id="note-${w._id}" placeholder="Admin note"></textarea>

        ${
          w.status === "PENDING"
            ? `
          <div class="actions">
            <button class="approve" onclick="processWithdraw('${w._id}','APPROVED')">Approve</button>
            <button class="reject" onclick="processWithdraw('${w._id}','REJECTED')">Reject</button>
          </div>`
            : ""
        }
      </div>
    `;
  });
}

async function processWithdraw(id, status) {
  const note = document.getElementById("note-" + id).value;

  const res = await fetch(API + "/admin/withdraw/" + id, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ status, adminNote: note })
  });

  const data = await res.json();
  alert(data.message || data.error);
  loadWithdraws();
}

function logout() {
  localStorage.removeItem("adminToken");
  location.href = "admin-login.html";
}

loadWithdraws();
