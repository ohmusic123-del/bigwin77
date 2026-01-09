// frontend/js/profile.js
// api.js must be loaded before this file

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

/* =========================
   LOAD PROFILE
========================= */
async function loadProfile() {
  try {
    const res = await fetch(API + "/profile", {
      headers: {
        Authorization: token
      }
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    document.getElementById("mobile").innerText = data.mobile;
    document.getElementById("wallet").innerText = "₹" + data.wallet.toFixed(2);
    document.getElementById("wagered").innerText =
      "₹" + data.totalWagered.toFixed(2);
  } catch (err) {
    console.error("Profile load error");
  }
}

/* =========================
   LOAD WITHDRAW DETAILS
========================= */
async function loadWithdrawDetails() {
  try {
    const res = await fetch(API + "/withdraw/details", {
      headers: {
        Authorization: token
      }
    });

    const data = await res.json();
    const box = document.getElementById("withdrawInfo");

    if (!data.method) {
      box.innerText = "No withdrawal details added";
      box.style.color = "orange";
      return;
    }

    if (data.method === "upi") {
      box.innerText = `UPI ID: ${data.details.upiId}`;
    }

    if (data.method === "bank") {
      box.innerText = `Bank: ${data.details.bankName}`;
    }

    if (data.method === "usdt") {
      box.innerText = `USDT Address: ${data.details.usdtAddress}`;
    }

    box.style.color = "#0f0";
  } catch (err) {
    console.error("Withdraw details error");
  }
}

/* =========================
   SAVE WITHDRAW DETAILS
========================= */
async function saveWithdrawDetails() {
  const method = document.getElementById("method").value;

  const body = { method };

  if (method === "upi") {
    body.upiId = document.getElementById("upiId").value;
    if (!body.upiId) return alert("Enter UPI ID");
  }

  if (method === "bank") {
    body.bankName = document.getElementById("bankName").value;
    body.accountNumber = document.getElementById("accountNumber").value;
    body.ifsc = document.getElementById("ifsc").value;
    body.accountHolder = document.getElementById("accountHolder").value;

    if (!body.bankName || !body.accountNumber || !body.ifsc || !body.accountHolder) {
      return alert("Fill all bank details");
    }
  }

  if (method === "usdt") {
    body.usdtAddress = document.getElementById("usdtAddress").value;
    if (!body.usdtAddress) return alert("Enter USDT address");
  }

  try {
    const res = await fetch(API + "/withdraw/details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    alert("Withdrawal details saved");
    loadWithdrawDetails();
  } catch (err) {
    console.error("Save withdraw error");
  }
}

/* =========================
   LOGOUT
========================= */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  loadWithdrawDetails();
});
