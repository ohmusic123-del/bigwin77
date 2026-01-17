async function register() {
  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;

  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Registration failed");
      return;
    }

    alert("Registered successfully ✅ Now login");
  } catch (err) {
    alert("Error: " + err.message);
  }
}

async function login() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    alert("Login successful ✅");
    window.location.href = "home.html";
  } catch (err) {
    alert("Error: " + err.message);
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
