const API = "https://color-game-backend1.onrender.com/api";
async function login() {
  const phone = phoneValue();
  const password = passValue();

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, password })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.message);

  localStorage.setItem("token", data.token);
  location.href = "home.html";
}

async function register() {
  const phone = phoneValue();
  const password = passValue();

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, password })
  });

  const data = await res.json();
  alert(data.message || "Registered");
}

function phoneValue() {
  return document.getElementById("phone").value.trim();
}

function passValue() {
  return document.getElementById("password").value.trim();
    }
