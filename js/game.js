async function placeBet(color) {
  const amount = document.getElementById("amount").value;
  if (!amount) return alert("Enter amount");

  const data = await apiPlaceBet(amount, color);
  alert(data.message || "Bet placed");
}
