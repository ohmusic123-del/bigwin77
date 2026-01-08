const API = "https://color-game-backend1.onrender.com";
const token = localStorage.getItem("token");

if (!token) location.href = "login.html";

async function submitDeposit() {
  const amount = document.getElementById("amount").value;
  const utr = document.getElementById("utr").value;

  const res = await fetch(API + "/deposit/request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ amount, utr })
  });

  const data = await res.json();
  alert(data.message || data.error);
}
async function loadDepositInfo() {
  const res = await fetch(API + "/deposit/info");
  const data = await res.json();

  document.getElementById("upiInfo").innerText =
    "UPI ID: " + (data.upiId || "Not available");

  if (data.qrImage) {
    document.getElementById("qrImage").src = data.qrImage;
  }
}

loadDepositInfo();
