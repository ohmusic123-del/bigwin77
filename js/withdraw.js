const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

async function withdraw() {
  const amount = Number(document.getElementById("amount").value || 0);
  const upiId = String(document.getElementById("upiId").value || "").trim();
  const method = document.getElementById("method").value;
  const status = document.getElementById("status");

  status.innerText = "Submitting...";

  if (!amount || amount <= 0) {
    status.innerText = "Enter valid amount";
    return;
  }

  if (!upiId) {
    status.innerText = "Enter UPI ID";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/wallet/withdraw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, method, upiId }),
    });

    const data = await res.json();

    if (!res.ok) {
      status.innerText = data.error || "Withdraw failed";
      return;
    }

    status.innerText = "Withdraw request submitted ✅ Waiting for admin approval";
  } catch (e) {
    status.innerText = "Error: " + e.message;
  }
}
