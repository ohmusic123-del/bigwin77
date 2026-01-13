const token = localStorage.getItem("adminToken");

if (!token) {
  window.location.href = "admin-login.html";
}

/* ======================
   LOGOUT
====================== */
function logout() {
  localStorage.removeItem("adminToken");
  window.location.href = "admin-login.html";
}

/* ======================
   LOAD STATS
====================== */
async function loadStats() {
  const res = await fetch(API + "/admin/stats", {
    headers: {
      Authorization: token
    }
  });

  const data = await res.json();

  document.getElementById("users").innerText = data.users;        // Changed
document.getElementById("deposits").innerText = data.deposits;  // Changed
document.getElementById("withdrawals").innerText = data.withdrawals; // Changed
document.getElementById("wallet").innerText = data.wallet;      // Changed
document.getElementById("profit").innerText = data.profit;
document.getElementById("rounds").innerText = data.rounds;      // Changed
}

/* ======================
   LOAD WITHDRAWS
====================== */
async function loadWithdraws() {
  const res = await fetch(API + "/admin/withdraws", {
    headers: {
      Authorization: token
    }
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
      <div class="withdraw-card">
        <div><b>Mobile:</b> ${w.mobile}</div>
        <div><b>Amount:</b> ₹${w.amount}</div>
        <div><b>Method:</b> ${w.method}</div>
        <div><b>Status:</b> ${w.status}</div>

        ${
          w.details
            ? `<div class="details">
                ${w.details.upiId ? "UPI: " + w.details.upiId : ""}
                ${w.details.accountNumber ? "<br>Acc: " + w.details.accountNumber : ""}
                ${w.details.usdtAddress ? "<br>USDT: " + w.details.usdtAddress : ""}
              </div>`
            : ""
        }

        ${
          w.status === "PENDING"
            ? `
            <textarea id="note-${w._id}" placeholder="Admin note"></textarea>
            <div class="actions">
              <button class="approve" onclick="processWithdraw('${w._id}','APPROVED')">Approve</button>
              <button class="reject" onclick="processWithdraw('${w._id}','REJECTED')">Reject</button>
            </div>
          `
            : `<div class="note">Note: ${w.adminNote || "-"}</div>`
        }
      </div>
    `;
  });
}

/* ======================
   PROCESS WITHDRAW
====================== */
async function processWithdraw(id, status) {
  const note = document.getElementById("note-" + id)?.value || "";

  const res = await fetch(API + "/admin/withdraw/" + id, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({
      status,
      adminNote: note
    })
  });

  const data = await res.json();
  alert(data.message || data.error);
  loadWithdraws();
  loadStats();
}

/* ======================
   INIT
====================== */
loadStats();
loadWithdraws();
