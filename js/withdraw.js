function setAmount(value) {
  document.getElementById("amount").value = value;
}

async function withdraw() {
  const amount = Number(document.getElementById("amount").value);

  if (amount < 100) {
    alert("Minimum withdrawal is ₹100");
    return;
  }

  const res = await fetch(API + "/withdraw", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    },
    body: JSON.stringify({ amount })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Withdrawal failed");
    return;
  }

  alert("Withdrawal request submitted");
  window.location.href = "wallet.html";
}
