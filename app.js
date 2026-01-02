const API = "https://YOUR-BACKEND-URL";
let token = localStorage.getItem("token");

function register() {
  fetch(API + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mobile: mobile.value,
      password: password.value
    })
  }).then(r=>r.json()).then(alert);
}

function login() {
  fetch(API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mobile: mobile.value,
      password: password.value
    })
  }).then(r=>r.json()).then(d=>{
    token = d.token;
    localStorage.setItem("token", token);
    wallet.innerText = "Wallet ₹" + d.wallet;
  });
}

function bet(color) {
  fetch(API + "/bet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({
      color,
      amount: Number(amount.value)
    })
  }).then(r=>r.json()).then(d=>{
    wallet.innerText = "Wallet ₹" + d.wallet;
    alert(d.message);
  });
}
