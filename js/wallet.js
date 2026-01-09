// frontend/js/wallet.js
// api.js must be loaded before this file

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

/* =========================
   LOAD WALLET BALANCE
========================= */
async function loadWallet() {
  try {
    const res = await fetch(API + "/wallet", {
      headers: {
        Authorization: token
      }
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    document.getElementById("walletBalance").innerText =
      "₹" + data.wallet.toFixed(2);
  } catch (err) {
    console.error("Wallet load error");
  }
}

/* =========================
   LOAD USER PROFILE (BASIC)
========================= */
async function loadProfile() {
  try {
    const res = await fetch(API + "/profile", {
      headers: {
        Authorization: token
      }
    });

    const data = await res.json();

    if (data.error) return;

    document.getElementById("userMobile").innerText = data.mobile;
    document.getElementById("totalWagered").innerText =
      "₹" + data.totalWagered.toFixed(2);
  } catch (err) {
    console.error("Profile load error");
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
  loadWallet();
  loadProfile();
});
