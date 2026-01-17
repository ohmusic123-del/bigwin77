async function adminLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const status = document.getElementById("status");

  status.innerText = "Logging in...";

  try {
    const res = await fetch(`${API_BASE}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      status.innerText = data.error || "Login failed";
      return;
    }

    localStorage.setItem("adminToken", data.token);
    status.innerText = "Login success ✅";
    window.location.href = "admin.html";
  } catch (e) {
    status.innerText = "Error: " + e.message;
  }
}
