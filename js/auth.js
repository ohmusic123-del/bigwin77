async function login() {
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;

  const data = await apiLogin(phone, password);

  if (data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "home.html";
  } else {
    alert(data.message || "Login failed");
  }
}

async function register() {
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;

  const data = await apiRegister(phone, password);
  alert(data.message || "Registered");
}
