const token = localStorage.getItem("adminToken");
if (!token) window.location.href = "admin-login.html";

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

async function loadDetails() {
  const userId = document.getElementById("userId").value.trim();
  if (!userId) return alert("Enter userId");

  const userBox = document.getElementById("userBox");
  const tabs = document.getElementById("tabs");

  userBox.innerHTML = "Loading...";
  tabs.innerHTML = "";

  try {
    const data = await api(`/api/admin/users/${userId}/details`);
    const u = data.user;

    userBox.innerHTML = `
      <div class="card">
        <p><b>${u.username}</b></p>
        <p>ID: ${u._id}</p>
        <p>Wallet: ₹${u.wallet} | Bonus: ₹${u.bonus}</p>
        <p>Blocked: ${u.isBlocked ? "YES ❌" : "NO ✅"}</p>
        <p>Bet Limit: ₹${u.betLimit}</p>
        <button onclick="toggleBlock('${u._id}', ${u.isBlocked ? "false" : "true"})">
          ${u.isBlocked ? "Unblock User" : "Block User"}
        </button>
        <button onclick="setBetLimit('${u._id}')">Set Bet Limit</button>
      </div>
    `;

    tabs.innerHTML = `
      <h3>Deposits</h3>${renderList(data.deposits)}
      <h3>Withdraws</h3>${renderList(data.withdraws)}
      <h3>Bets</h3>${renderList(data.bets)}
      <h3>Bonus Logs</h3>${renderList(data.bonusLogs)}
    `;
  } catch (e) {
    userBox.innerHTML = e.message;
  }
}

function renderList(arr) {
  if (!arr || !arr.length) return `<p>No data</p>`;
  return arr
    .map(
      (x) => `
    <div class="card">
      <pre style="white-space:pre-wrap">${JSON.stringify(x, null, 2)}</pre>
    </div>
  `
    )
    .join("");
}

async function toggleBlock(userId, isBlocked) {
  try {
    await api("/api/admin/users/block", {
      method: "POST",
      body: JSON.stringify({ userId, isBlocked }),
    });
    alert("Updated ✅");
    loadDetails();
  } catch (e) {
    alert(e.message);
  }
}

async function setBetLimit(userId) {
  const betLimit = prompt("Enter new bet limit:");
  if (!betLimit) return;

  try {
    await api("/api/admin/users/bet-limit", {
      method: "POST",
      body: JSON.stringify({ userId, betLimit: Number(betLimit) }),
    });
    alert("Bet limit updated ✅");
    loadDetails();
  } catch (e) {
    alert(e.message);
  }
}

window.loadDetails = loadDetails;
