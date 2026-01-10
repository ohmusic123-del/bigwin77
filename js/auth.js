/* =========================
   AUTH : LOGIN & REGISTER
========================= */

// Elements
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

if (loginBtn) loginBtn.addEventListener("click", login);
if (registerBtn) registerBtn.addEventListener("click", registerUser);

/* =========================
        REGISTER
========================= */
async function registerUser() {
  const mobile = document.getElementById("mobile").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!mobile || !password) {
    alert("Enter mobile & password");
    return;
  }

  try {
    const res = await fetch(API + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Registration failed");
      return;
    }

    alert("Registered successfully ✅ Now login");
  } catch (err) {
    alert("Server error");
  }
}

/* =========================
        LOGIN
========================= */
async function login() {
  const mobile = document.getElementById("mobile").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!mobile || !password) {
    alert("Enter mobile & password");
    return;
  }

  try {
    const res = await fetch(API + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    // ✅ Save token
    localStorage.setItem("token", data.token);

    // Redirect
    window.location.href = "home.html";
  } catch (err) {
    alert("Server error");
  }
}

/* =========================
        LOGOUT
========================= */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
