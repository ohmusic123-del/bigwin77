// profile.js

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

async function loadProfile() {
  try {
    const res = await fetch(API + "/profile", {
      headers: {
        Authorization: token
      }
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Session expired");
      logout();
      return;
    }

    document.getElementById("mobile").innerText = data.mobile;
    document.getElementById("wallet").innerText = data.wallet;
    document.getElementById("wagered").innerText = data.totalWagered;
  } catch {
    alert("Server error");
  }
}

function goWithdraw() {
  window.location.href = "withdraw.html";
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

loadProfile();
