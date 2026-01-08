const API = "https://color-game-backend1.onrender.com";
const token = localStorage.getItem("adminToken");

/* =========================
   AUTH GUARD
========================= */
if (!token) {
  window.location.href = "admin-login.html";
}

/* =========================
   LOAD WITHDRAW REQUESTS
========================= */
async function loadWithdraws() {
  const res = await fetch(API + "/admin/withdraws", {
    headers: {
      Authorization: token   // ✅ JWT TOKEN
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
        <div class="card-row"><b>Mobile:</b> ${w.mobile}</div>
        <div class="card-row"><b>Amount:</b> ₹${w.amount}</div>
        <div class="card-row"><b>Method:</b> ${w.method}</div>
        <div class="card-row"><b>Status:</b> ${w.status}</div>

        <textarea class="note" id="note-${w._id}" placeholder="Admin note">${w.adminNote || ""}</textarea>

        ${
          w.status === "PENDING"
            ? `
          <div class="actions">
            <button class="approve" onclick="processWithdraw('${w._id}','APPROVED')">Approve</button>
            <button class="reject" onclick="processWithdraw('${w._id}','REJECTED')">Reject</button>
          </div>
        `
            : `<p class="processed">Processed</p>`
        }
      </div>
    `;
  });
}

/* =========================
   PROCESS WITHDRAW
========================= */
async function processWithdraw(id, status) {
  const note = document.getElementById("note-" + id).value;

  const res = await fetch(API + "/admin/withdraw/" + id, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token   // ✅ JWT TOKEN
    },
    body: JSON.stringify({
      status,
      adminNote: note
    })
  });

  const data = await res.json();
  alert(data.message || data.error);
  loadWithdraws();
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
loadWithdraws();
