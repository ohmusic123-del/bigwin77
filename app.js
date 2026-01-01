const API = "https://color-game-backend.onrender.com";

const app = document.getElementById("app");

async function loadWallet() {
  const res = await fetch(API + "/wallet");
  const data = await res.json();
  document.getElementById("wallet").innerText = data.balance;
}

app.innerHTML = `
  <h1 class="text-2xl font-bold text-center mb-4">🎮 Color Prediction</h1>

  <div class="bg-white p-4 rounded shadow">
    <p class="text-center mb-2">Wallet: 💰 <span id="wallet">...</span></p>

    <div class="grid grid-cols-3 gap-3 mt-3">
      <button onclick="bet('RED')" class="bg-red-500 text-white p-3 rounded">RED</button>
      <button onclick="bet('VIOLET')" class="bg-purple-500 text-white p-3 rounded">VIOLET</button>
      <button onclick="bet('GREEN')" class="bg-green-500 text-white p-3 rounded">GREEN</button>
    </div>

    <p id="msg" class="text-center mt-4 text-sm"></p>
  </div>
`;

loadWallet();

async function bet(color) {
  const res = await fetch(API + "/bet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ color, amount: 100 })
  });

  const data = await res.json();

  document.getElementById("wallet").innerText = data.wallet;

  document.getElementById("msg").innerText =
    data.win
      ? `🎉 You WON! Result: ${data.result}`
      : `❌ You LOST. Result: ${data.result}`;
}
