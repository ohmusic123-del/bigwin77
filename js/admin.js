const token = localStorage.getItem("adminToken");

if (!token) {
  window.location.href = "admin-login.html";
}

let currentTab = "dashboard";
let currentFilter = "all";

/* ======================
   LOGOUT
====================== */
function logout() {
  localStorage.removeItem("adminToken");
  window.location.href = "admin-login.html";
}

/* ======================
   TAB SWITCHING
====================== */
document.addEventListener("DOMContentLoaded", () => {
  // Tab buttons
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabName = btn.dataset.tab;

      // Remove active class from all
      tabBtns.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      // Add active to clicked
      btn.classList.add("active");
      document.getElementById(tabName).classList.add("active");

      currentTab = tabName;

      // Load data for tab
      loadTabData(tabName);
    });
  });

  // Filter buttons
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const parent = btn.parentElement;
      parent.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      currentFilter = btn.dataset.filter;
      loadTabData(currentTab);
    });
  });

  // User search
  const userSearch = document.getElementById("userSearch");
  if (userSearch) {
    userSearch.addEventListener("input", (e) => {
      searchUsers(e.target.value);
    });
  }

  // Initial load
  loadDashboard();
});

/* ======================
   LOAD TAB DATA
====================== */
function loadTabData(tab) {
  switch(tab) {
    case "dashboard":
      loadDashboard();
      break;
    case "users":
      loadUsers();
      break;
    case "deposits":
      loadDeposits();
      break;
    case "withdrawals":
      loadWithdrawals();
      break;
    case "transactions":
      loadTransactions();
      break;
    case "settings":
      loadSettings();
      break;
  }
}

/* ======================
   DASHBOARD
====================== */
async function loadDashboard() {
  try {
    const res = await fetch(API + "/admin/stats", {
      headers: { Authorization: token }
    });

    const data = await res.json();

    document.getElementById("totalUsers").textContent = data.users || 0;
    document.getElementById("totalDeposits").textContent = (data.deposits || 0).toLocaleString();
    document.getElementById("totalWithdrawals").textContent = (data.withdrawals || 0).toLocaleString();
    document.getElementById("totalWallet").textContent = (data.wallet || 0).toLocaleString();
    document.getElementById("totalProfit").textContent = (data.profit || 0).toLocaleString();
    document.getElementById("totalRounds").textContent = data.rounds || 0;

    // Load recent activity
    loadRecentActivity();
  } catch (err) {
    console.error("Dashboard error:", err);
    alert("Failed to load dashboard stats");
  }
}

async function loadRecentActivity() {
  try {
    const res = await fetch(API + "/admin/recent-activity", {
      headers: { Authorization: token }
    });

    const data = await res.json();
    const container = document.getElementById("recentActivity");

    if (!data || data.length === 0) {
      container.innerHTML = "<p style='color: #94a3b8; text-align: center;'>No recent activity</p>";
      return;
    }

    container.innerHTML = data.slice(0, 10).map(activity => `
      <div class="table-row">
        <div class="row-header">
          <span class="row-title">${activity.type}</span>
          <span class="row-status ${activity.status.toLowerCase()}">${activity.status}</span>
        </div>
        <div class="row-details">
          ${activity.mobile} • ₹${activity.amount} • ${new Date(activity.createdAt).toLocaleString()}
        </div>
      </div>
    `).join("");
  } catch (err) {
    console.error("Recent activity error:", err);
  }
}

function refreshStats() {
  loadDashboard();
  alert("Stats refreshed!");
}

function pauseGame() {
  // TODO: Implement game pause functionality
  alert("Game paused (feature coming soon)");
}

function resumeGame() {
  // TODO: Implement game resume functionality
  alert("Game resumed (feature coming soon)");
}

/* ======================
   USERS
====================== */
let allUsers = [];

async function loadUsers() {
  try {
    const res = await fetch(API + "/admin/users", {
      headers: { Authorization: token }
    });

    allUsers = await res.json();
    displayUsers(allUsers);
  } catch (err) {
    console.error("Users error:", err);
    alert("Failed to load users");
  }
}

function displayUsers(users) {
  const container = document.getElementById("usersList");

  if (!users || users.length === 0) {
    container.innerHTML = "<p style='color: #94a3b8; text-align: center;'>No users found</p>";
    return;
  }

  container.innerHTML = users.map(user => `
    <div class="table-row">
      <div class="row-header">
        <span class="row-title">${user.mobile}</span>
        <span class="row-status ${user.deposited ? 'success' : 'pending'}">
          ${user.deposited ? 'ACTIVE' : 'NEW'}
        </span>
      </div>
      <div class="row-details">
        Wallet: ₹${user.wallet.toLocaleString()} | 
        Wagered: ₹${(user.totalWagered || 0).toLocaleString()} | 
        Deposited: ₹${(user.depositAmount || 0).toLocaleString()} |
        Joined: ${new Date(user.createdAt).toLocaleDateString()}
      </div>
      <div class="row-actions">
        <button class="btn-approve" onclick="editUserBalance('${user.mobile}')">Edit Balance</button>
        <button class="btn-reject" onclick="banUser('${user.mobile}')">Ban User</button>
      </div>
    </div>
  `).join("");
}

function searchUsers(query) {
  if (!query) {
    displayUsers(allUsers);
    return;
  }

  const filtered = allUsers.filter(user => 
    user.mobile.includes(query)
  );

  displayUsers(filtered);
}

function editUserBalance(mobile) {
  const amount = prompt(`Enter amount to ADD/DEDUCT for ${mobile}:\n(Use negative number to deduct)`);
  
  if (amount === null) return;

  const numAmount = parseFloat(amount);

  if (isNaN(numAmount)) {
    alert("Invalid amount");
    return;
  }

  fetch(API + "/admin/user/balance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ mobile, amount: numAmount })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message || "Balance updated");
    loadUsers();
  })
  .catch(err => {
    console.error("Balance update error:", err);
    alert("Failed to update balance");
  });
}

function banUser(mobile) {
  if (!confirm(`Are you sure you want to ban ${mobile}?`)) return;

  alert("Ban feature coming soon!");
  // TODO: Implement ban functionality
}

/* ======================
   DEPOSITS
====================== */
let allDeposits = [];

async function loadDeposits() {
  try {
    const res = await fetch(API + "/admin/deposits", {
      headers: { Authorization: token }
    });

    allDeposits = await res.json();
    displayDeposits(allDeposits);
  } catch (err) {
    console.error("Deposits error:", err);
    alert("Failed to load deposits");
  }
}

function displayDeposits(deposits) {
  const container = document.getElementById("depositsList");

  // Filter
  let filtered = deposits;
  if (currentFilter !== "all") {
    filtered = deposits.filter(d => d.status === currentFilter);
  }

  if (!filtered || filtered.length === 0) {
    container.innerHTML = "<p style='color: #94a3b8; text-align: center;'>No deposits found</p>";
    return;
  }

  container.innerHTML = filtered.map(dep => `
    <div class="table-row">
      <div class="row-header">
        <span class="row-title">${dep.mobile}</span>
        <span class="row-status ${dep.status.toLowerCase()}">${dep.status}</span>
      </div>
      <div class="row-details">
        Amount: ₹${dep.amount.toLocaleString()} | 
        Method: ${dep.method.toUpperCase()} | 
        ${dep.referenceId ? `Ref: ${dep.referenceId} | ` : ''}
        Date: ${new Date(dep.createdAt).toLocaleString()}
      </div>
      ${dep.status === "PENDING" ? `
        <div class="row-actions">
          <textarea id="note-dep-${dep._id}" placeholder="Admin note (optional)"></textarea>
          <button class="btn-approve" onclick="processDeposit('${dep._id}', 'SUCCESS')">Approve</button>
          <button class="btn-reject" onclick="processDeposit('${dep._id}', 'FAILED')">Reject</button>
        </div>
      ` : `
        <div class="row-details" style="margin-top: 8px; color: #fbbf24;">
          Note: ${dep.adminNote || "No note"}
        </div>
      `}
    </div>
  `).join("");
}

async function processDeposit(id, status) {
  const note = document.getElementById(`note-dep-${id}`)?.value || "";

  try {
    const res = await fetch(API + `/admin/deposit/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ status, adminNote: note })
    });

    const data = await res.json();
    alert(data.message || `Deposit ${status.toLowerCase()}`);
    loadDeposits();
    loadDashboard();
  } catch (err) {
    console.error("Process deposit error:", err);
    alert("Failed to process deposit");
  }
}

/* ======================
   WITHDRAWALS
====================== */
let allWithdrawals = [];

async function loadWithdrawals() {
  try {
    const res = await fetch(API + "/admin/withdraws", {
      headers: { Authorization: token }
    });

    allWithdrawals = await res.json();
    displayWithdrawals(allWithdrawals);
  } catch (err) {
    console.error("Withdrawals error:", err);
    alert("Failed to load withdrawals");
  }
}

function displayWithdrawals(withdrawals) {
  const container = document.getElementById("withdrawalsList");

  // Filter
  let filtered = withdrawals;
  if (currentFilter !== "all") {
    filtered = withdrawals.filter(w => w.status === currentFilter);
  }

  if (!filtered || filtered.length === 0) {
    container.innerHTML = "<p style='color: #94a3b8; text-align: center;'>No withdrawals found</p>";
    return;
  }

  container.innerHTML = filtered.map(w => `
    <div class="table-row">
      <div class="row-header">
        <span class="row-title">${w.mobile}</span>
        <span class="row-status ${w.status.toLowerCase()}">${w.status}</span>
      </div>
      <div class="row-details">
        Amount: ₹${w.amount.toLocaleString()} | 
        Method: ${w.method.toUpperCase()} | 
        ${w.details?.upiId ? `UPI: ${w.details.upiId} | ` : ''}
        ${w.details?.accountNumber ? `Account: ${w.details.accountNumber} | ` : ''}
        Date: ${new Date(w.createdAt).toLocaleString()}
      </div>
      ${w.status === "PENDING" ? `
        <div class="row-actions">
          <textarea id="note-with-${w._id}" placeholder="Admin note (optional)"></textarea>
          <button class="btn-approve" onclick="processWithdrawal('${w._id}', 'APPROVED')">Approve</button>
          <button class="btn-reject" onclick="processWithdrawal('${w._id}', 'REJECTED')">Reject</button>
        </div>
      ` : `
        <div class="row-details" style="margin-top: 8px; color: #fbbf24;">
          Note: ${w.adminNote || "No note"}
        </div>
      `}
    </div>
  `).join("");
}

async function processWithdrawal(id, status) {
  const note = document.getElementById(`note-with-${id}`)?.value || "";

  try {
    const res = await fetch(API + `/admin/withdraw/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ status, adminNote: note })
    });

    const data = await res.json();
    alert(data.message || `Withdrawal ${status.toLowerCase()}`);
    loadWithdrawals();
    loadDashboard();
  } catch (err) {
    console.error("Process withdrawal error:", err);
    alert("Failed to process withdrawal");
  }
}

/* ======================
   TRANSACTIONS
====================== */
async function loadTransactions() {
  try {
    const res = await fetch(API + "/admin/transactions", {
      headers: { Authorization: token }
    });

    const data = await res.json();
    displayTransactions(data);
  } catch (err) {
    console.error("Transactions error:", err);
    alert("Failed to load transactions");
  }
}

function displayTransactions(transactions) {
  const container = document.getElementById("transactionsList");

  // Filter
  let filtered = transactions;
  if (currentFilter !== "all") {
    filtered = transactions.filter(t => t.type === currentFilter);
  }

  if (!filtered || filtered.length === 0) {
    container.innerHTML = "<p style='color: #94a3b8; text-align: center;'>No transactions found</p>";
    return;
  }

  container.innerHTML = filtered.slice(0, 50).map(t => `
    <div class="table-row">
      <div class="row-header">
        <span class="row-title">${t.mobile}</span>
        <span class="row-status ${t.type}">${t.type.toUpperCase()}</span>
      </div>
      <div class="row-details">
        Amount: ₹${t.amount.toLocaleString()} | 
        Status: ${t.status} | 
        Date: ${new Date(t.createdAt).toLocaleString()}
      </div>
    </div>
  `).join("");
}

function exportTransactions() {
  alert("Export feature coming soon!");
  // TODO: Implement CSV export
}

/* ======================
   SETTINGS
====================== */
async function loadSettings() {
  try {
    const res = await fetch(API + "/admin/settings", {
      headers: { Authorization: token }
    });

    const settings = await res.json();

    document.getElementById("minBet").value = settings.minBet || 1;
    document.getElementById("maxBet").value = settings.maxBet || 10000;
    document.getElementById("houseEdge").value = (settings.houseEdge * 100) || 2;
    document.getElementById("minDeposit").value = settings.minDeposit || 100;
    document.getElementById("minWithdraw").value = settings.minWithdraw || 100;
    document.getElementById("upiId").value = settings.upiId || "";
    document.getElementById("bonusPercent").value = settings.bonusPercent || 100;
  } catch (err) {
    console.error("Settings error:", err);
  }
}

async function updateSetting(key) {
  const value = document.getElementById(key).value;

  try {
    const res = await fetch(API + "/admin/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ key, value })
    });

    const data = await res.json();
    alert(data.message || "Setting updated");
  } catch (err) {
    console.error("Update setting error:", err);
    alert("Failed to update setting");
  }
      }
