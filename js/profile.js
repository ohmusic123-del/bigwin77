async function loadProfile() {
  const res = await fetch(API + "/profile", {
    headers: {
      Authorization: localStorage.getItem("token")
    }
  });

  const data = await res.json();

  if (!res.ok) {
    alert("Session expired");
    logout();
    return;
  }

  document.getElementById("mobile").innerText = data.mobile;
  document.getElementById("wallet").innerText = data.wallet;
  document.getElementById("wagered").innerText = data.totalWagered;
}

loadProfile();
