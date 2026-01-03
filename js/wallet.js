async function loadWallet() {
  const data = await apiWallet();
  if (data.balance !== undefined) {
    document.getElementById("wallet").innerText = "₹" + data.balance;
  }
}

loadWallet();
