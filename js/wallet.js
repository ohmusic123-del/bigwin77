const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

async function loadWallet() {
  try {
    const res = await fetch(`${API_BASE}/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to load wallet");
      return;
    }

    // You can show wallet data on wallet.html if you add elements
    console.log("User wallet:", data.user.wallet);
    console.log("User bonus:", data.user.bonus);
  } catch (e) {
    alert("Error: " + e.message);
  }
}

loadWallet();
