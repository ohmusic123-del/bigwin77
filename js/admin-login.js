async function adminLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorEl = document.getElementById("error");

  errorEl.innerText = "";

  if (!username || !password) {
    errorEl.innerText = "Enter username and password";
    return;
  }

  try {
    const res = await fetch(API + "/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorEl.innerText = data.error || "Login failed";
      return;
    }

    localStorage.setItem("adminToken", data.token);
    window.location.href = "admin.html";

  } catch (err) {
    errorEl.innerText = "Server error";
  }
}
