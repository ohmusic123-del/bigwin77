const API = "https://color-game-backend1.onrender.com";
const adminToken = localStorage.getItem("adminToken");

if (!adminToken) location.href = "admin-login.html";

/* TAB SWITCH */
function showTab(id) {
  document.querySelectorAll(".tab-content").forEach(t => t.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
  event.target.classList.add("active");
}

/* LOGOUT */
function logout() {
  localStorage.removeItem("adminToken");
  location.href = "admin-login.html";
}

/* LOAD DEPOSITS */
async function loadDeposits() {
  const res = await fetch(API + "/admin/deposits", {
    headers: { Authorization: adminToken }
  });

  const data = await res.json();
  const list = document.getElementById("depositList");
  list.innerHTML = "";

  if (!data.length) {
    list.innerHTML = "<p>No deposit requests</p>";
    return;
  }

  data.forEach(d => {
    list.innerHTML += `
      <div class="card">
        <b>Mobile:</b> ${d.mobile}<br>
        <b>Amount:</b> ₹${d.amount}<br>
        <b>UTR:</b> ${d.utr}<br>
        <b>Status:</b> ${d.status}<br>
        ${
          d.status === "PENDING"
            ? `
              <button class="approve" onclick="processDeposit('${d._id}','APPROVED')">Approve</button>
              <button class="reject" onclick="processDeposit('${d._id}','REJECTED')">Reject</button>
            `
            : ""
        }
      </div>
    `;
  });
}

/* PROCESS DEPOSIT */
async function processDeposit(id, status) {
  await fetch(API + "/admin/deposit/" + id, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: adminToken
    },
    body: JSON.stringify({ status })
  });

  loadDeposits();
}

/* INIT */
loadDeposits();
async function saveDepositInfo() {
  const upiId = document.getElementById("upiId").value;
  const qrImage = document.getElementById("qrImage").value;

  const res = await fetch(API + "/admin/deposit-info", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("adminToken")
    },
    body: JSON.stringify({ upiId, qrImage })
  });

  const data = await res.json();
  alert(data.message || data.error);
}
