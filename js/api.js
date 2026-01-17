async function apiRequest(endpoint, method = "GET", body = null, isAdmin = false) {
  const tokenKey = isAdmin ? "adminToken" : "token";
  const token = localStorage.getItem(tokenKey);

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "API request failed");
  }

  return data;
}
