const API = "https://color-game-backend1.onrender.com";

async function login() {
  const mobile = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value.trim();

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, password })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Login failed");
    return;
  }

  localStorage.setItem("token", data.token);
  location.href = "home.html";
}

async function register() {
  const mobile = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value.trim();

  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, password })
  });

  const data = await res.json();
  alert(data.message || data.error);
}
