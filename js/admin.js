// frontend/js/admin.js

// api.js must be loaded before this file
// <script src="js/api.js"></script>

const token = localStorage.getItem("adminToken");

if (!token) {
  window.location.href = "admin-login.html";
}

/* =========================
   LOAD DASHBOARD STATS
========================= */
async function loadStats() {
  try {
    const res = await fetch(API + "/admin/stats", {
      headers: {
        Authorization: token
      }
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to load stats");
      return;
    }

    document.getElementById("users").innerText = data.totalUsers;
    document.getElementById("deposits").innerText = data.totalDeposits;
    document.getElementById("withdrawals").innerText = data.totalWithdrawals;
    document.getElementById("wallet").innerText = data.totalWallet;
    document.getElementById("rounds").innerText = data.totalRounds;
    document.getElementById("profit").innerText = data.profit;

  } catch (err) {
    alert("Error loading stats");
  }
}

/* =========================
   LOAD WITHDRAW REQUESTS
========================= */
async function loadWithdraws() {
  try {
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
        <div class="card">
          <div><b>Mobile:</b> ${w.mobile}</div>
          <div><b>Amount:</b> ₹${w.amount}</div>
          <div><b>Method:</b> ${w.method || "-"}</div>
          <div><b>Status:</b> ${w.status}</div>

          <textarea id="note-${w._id}" placeholder="Admin note">${w.adminNote || ""}</textarea>

          ${
            w.status === "PENDING"
              ? `
              <div class="actions">
                <button class="approve" onclick="processWithdraw('${w._id}','APPROVED')">
                  Approve
                </button>
                <button class="reject" onclick="processWithdraw('${w._id}','REJECTED')">
                  Reject
                </button>
              </div>
            `
              : ""
          }
        </div>
      `;
    });

  } catch (err) {
    alert("Error loading withdraws");
  }
}

/* =========================
   PROCESS WITHDRAW
========================= */
async function processWithdraw(id, status) {
  const note = document.getElementById("note-" + id)?.value || "";

  try {
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

  } catch (err) {
    alert("Error processing withdraw");
  }
}

/* =========================
   LOGOUT
========================= */
function logout() {
  localStorage.removeItem("adminToken");
  window.location.href = "admin-login.html";
}

/* =========================
   INIT
========================= */
loadStats();
loadWithdraws();
