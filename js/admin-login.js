// frontend/js/admin-login.js

// api.js must be loaded before this file
// <script src="js/api.js"></script>

const adminLoginForm = document.getElementById("adminLoginForm");

async function adminLogin(e) {
  e.preventDefault();

  const username = document.getElementById("adminUsername").value.trim();
  const password = document.getElementById("adminPassword").value.trim();

  if (!username || !password) {
    alert("Enter admin username and password");
    return;
  }

  try {
    const res = await fetch(API + "/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Admin login failed");
      return;
    }

    // ✅ Save admin token separately
    localStorage.setItem("adminToken", data.token);

    // Redirect to admin dashboard
    window.location.href = "admin.html";

  } catch (err) {
    alert("Server error");
  }
}

/* =========================
   AUTO ATTACH
========================= */
if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", adminLogin);
}
